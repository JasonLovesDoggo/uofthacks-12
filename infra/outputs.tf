output "rds_endpoint" {
  value = aws_db_instance.flowshield_db.endpoint
}

output "alb_dns_name" {
  value = aws_lb.flowshield_alb.dns_name
}