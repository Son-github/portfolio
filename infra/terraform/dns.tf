# DNS는 가비아에서 관리합니다. Route 53 영역이나 DNS 레코드를 생성하지 않습니다.
# 1단계: request_certificate = true로 인증서와 인증 CNAME 출력만 준비합니다.
resource "aws_acm_certificate" "site" {
  count = var.request_certificate ? 1 : 0

  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# 2단계: 가비아에 인증 CNAME을 등록한 뒤 enable_custom_domain = true로 연결합니다.
# 인증용 DNS 레코드는 Terraform이 작성하지 않으며, ACM의 ISSUED 상태를 기다립니다.
resource "aws_acm_certificate_validation" "site" {
  count = var.enable_custom_domain ? 1 : 0

  certificate_arn = aws_acm_certificate.site[0].arn
  validation_record_fqdns = [
    for record in aws_acm_certificate.site[0].domain_validation_options : record.resource_record_name
  ]
}
