interface LogDetailsPageProps {
    params: Promise<{ id: string }>
}

export default async function LogDetailsPage({
    params,
}: LogDetailsPageProps) {
    const id = (await params).id
    return <div>Log Details {id}</div>;
    // TODO
}
