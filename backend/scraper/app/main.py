import schedule
import time
import threading
import os
from litestar import Litestar
from litestar.background_tasks import BackgroundTask
from litestar.di import Provide

from ingresser import send_order_to_api
from gmail_service import (
    get_service,
    fetch_new_emails,
    is_order_confirmation,
    parse_order,
)
from config_manager import ConfigHandler
import asyncio

# Configuration paths
CONFIG_PATH = "accounts.json"
API_URL = os.environ.get("API_URL", "https://api.example.com/orders")

# Initialize configuration handler
config_handler = ConfigHandler(CONFIG_PATH)


# Function to poll Gmail accounts
def poll_gmail_accounts():
    accounts_config = config_handler.config
    for account in accounts_config:
        credentials = account["credentials"]
        service = get_service(credentials)
        emails = fetch_new_emails(service)
        for email in emails:
            if is_order_confirmation(email):
                try:
                    order = parse_order(email)
                    asyncio.run(send_order_to_api(order, API_URL))
                    # Optionally, mark the email as read or archive it
                except Exception as e:
                    print(f"Error processing email: {e}")


# Scheduler loop
def scheduler_loop():
    while True:
        schedule.run_pending()
        time.sleep(1)


# Background task for scheduler
async def run_scheduler(background_task: BackgroundTask):
    threading.Thread(target=scheduler_loop).start()


# Litestar app
app = Litestar(
    route_handlers=[],
    on_startup=[Provide(run_scheduler)],
)

# Schedule the polling task
schedule.every(5).minutes.do(poll_gmail_accounts)

# Start the configuration watcher
config_watcher = threading.Thread(
    target=config_handler.start_watching, args=(CONFIG_PATH,)
)
config_watcher.start()

# Run the app
if __name__ == "__main__":
    app.run()
