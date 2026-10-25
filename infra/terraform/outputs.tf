output "bucket_name" {
  description = "정적 파일을 저장할 비공개 S3 버킷 이름입니다."
  value       = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "cloudfront_url" {
  description = "도메인 활성화와 무관하게 사용하는 AWS 기본 HTTPS 주소입니다."
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "cloudfront_domain_name" {
  description = "가비아의 www CNAME 값에 넣을 주소입니다. https:// 접두사가 없습니다."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "website_url" {
  value = var.enable_custom_domain ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "certificate_arn" {
  description = "가비아 DNS에서 검증할 ACM 인증서 ARN입니다."
  value       = var.request_certificate ? aws_acm_certificate.site[0].arn : null
}

output "acm_dns_validation_records" {
  description = "가비아 DNS 관리 화면에 직접 등록할 인증용 CNAME입니다."
  value = var.request_certificate ? [
    for record in aws_acm_certificate.site[0].domain_validation_options : {
      name  = record.resource_record_name
      type  = record.resource_record_type
      value = record.resource_record_value
    }
  ] : []
}

output "github_deploy_role_arn" {
  description = "GitHub Actions용 배포 역할입니다. 역할 구성을 비활성화하면 null입니다."
  value       = var.enable_github_actions ? aws_iam_role.github_deploy[0].arn : null
}

output "github_actions_variables" {
  description = "향후 인프라 준비 후 GitHub Repository Variables로 옮길 값입니다. 배포 활성화는 별도로 결정합니다."
  value = {
    DEPLOY_ENABLED             = "false"
    AWS_ROLE_ARN               = var.enable_github_actions ? aws_iam_role.github_deploy[0].arn : null
    AWS_ACCOUNT_ID             = var.expected_account_id
    AWS_REGION                 = var.aws_region
    S3_BUCKET_NAME             = aws_s3_bucket.site.id
    CLOUDFRONT_DISTRIBUTION_ID = aws_cloudfront_distribution.site.id
    SITE_URL                   = var.enable_custom_domain ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.site.domain_name}"
  }
}
