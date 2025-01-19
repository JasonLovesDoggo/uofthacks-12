resource "aws_s3_bucket" "flowshield_data" {
  bucket = "flowshield-data-bucket"
  acl    = "private"

  tags = {
    Name = "Flowshield Data Bucket"
  }
}