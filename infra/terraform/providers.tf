provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile

  # 프로필이나 환경 변수가 달라져도 다른 계정에 생성하지 못하도록 제한합니다.
  allowed_account_ids = [var.expected_account_id]

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "Terraform"
    }
  }
}
