resource "aws_ecs_cluster" "flowshield_cluster" {
  name = "flowshield-cluster"
}

resource "aws_ecs_task_definition" "flowshield_task" {
  family                   = "flowshield-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "flowshield-backend"
      image     = "flowshield/backend:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "flowshield_service" {
  name            = "flowshield-service"
  cluster         = aws_ecs_cluster.flowshield_cluster.id
  task_definition = aws_ecs_task_definition.flowshield_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.public_subnet.id]
    security_groups = [aws_security_group.flowshield_sg.id]
  }
}