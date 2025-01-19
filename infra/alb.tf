resource "aws_lb" "flowshield_alb" {
  name               = "flowshield-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.flowshield_sg.id]
  subnets            = [aws_subnet.public_subnet.id]

  tags = {
    Name = "Flowshield ALB"
  }
}

resource "aws_lb_target_group" "flowshield_tg" {
  name     = "flowshield-tg"
  port     = 5000
  protocol = "HTTP"
  vpc_id   = aws_vpc.flowshield_vpc.id
}

resource "aws_lb_listener" "flowshield_listener" {
  load_balancer_arn = aws_lb.flowshield_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.flowshield_tg.arn
  }
}