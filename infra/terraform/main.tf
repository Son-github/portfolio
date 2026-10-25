locals {
  # 계정 ID를 포함해 S3의 전역 이름 충돌을 줄입니다.
  bucket_name = "${var.project_name}-${var.expected_account_id}-${var.aws_region}"

  # AWS 관리형 정책을 사용합니다. 별도의 커스텀 정책 리소스는 만들지 않습니다.
  caching_optimized_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  security_headers_policy_id  = "67f7725c-6f97-4210-82d7-5512b31e9d03"
}
