resource "aws_db_instance" "flowshield_db" {
  identifier           = "flowshield-db"
  engine               = "postgres"
  engine_version       = "13.7"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  storage_type         = "gp2"
  username             = "flowshield_admin"
  password             = var.db_password
  parameter_group_name = "default.postgres13"
  publicly_accessible  = false
  skip_final_snapshot  = true
  vpc_security_group_ids = [aws_security_group.flowshield_sg.id]
  db_subnet_group_name = aws_db_subnet_group.flowshield_db_subnet_group.name
}

resource "aws_db_subnet_group" "flowshield_db_subnet_group" {
  name       = "flowshield-db-subnet-group"
  subnet_ids = [aws_subnet.public_subnet.id]
}