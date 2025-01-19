resource "aws_vpc" "flowshield_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "Flowshield VPC"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id            = aws_vpc.flowshield_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "Flowshield Public Subnet"
  }
}

resource "aws_security_group" "flowshield_sg" {
  vpc_id = aws_vpc.flowshield_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Flowshield Security Group"
  }
}