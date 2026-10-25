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

# CloudFront에 연결할 인증서와 발급 확인만 버지니아 제공자를 사용합니다.
provider "aws" {
  alias   = "us_east_1"
  region  = "us-east-1"
  profile = var.aws_profile

  allowed_account_ids = [var.expected_account_id]

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "Terraform"
    }
  }
}
