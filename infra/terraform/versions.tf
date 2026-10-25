terraform {
  required_version = ">= 1.9.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      # 검토한 AWS 제공자 버전 범위를 고정합니다.
      version = "~> 6.70.0"
    }
  }

  # 별도 상태 저장용 AWS 자원을 만들지 않고 기본 로컬 상태를 사용합니다.
}
