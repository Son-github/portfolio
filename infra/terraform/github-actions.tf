locals {
  github_oidc_url         = "https://token.actions.githubusercontent.com"
  github_repository_parts = split("/", var.github_repository)
  # 2026-07-15 이후 생성된 저장소의 기본 subject에는 변경 불가능한 숫자 ID가 포함됩니다.
  github_oidc_subject = "repo:${local.github_repository_parts[0]}@${var.github_owner_id}/${local.github_repository_parts[1]}@${var.github_repository_id}:ref:refs/heads/${var.github_deploy_branch}"
  github_oidc_provider_arn = !var.enable_github_actions ? null : (
    var.create_github_oidc_provider
    ? aws_iam_openid_connect_provider.github[0].arn
    : data.aws_iam_openid_connect_provider.github[0].arn
  )
}

# 다른 프로젝트가 사용하는 계정 공통 OIDC 제공자는 새로 생성하거나 소유하지 않습니다.
data "aws_iam_openid_connect_provider" "github" {
  count = var.enable_github_actions && !var.create_github_oidc_provider ? 1 : 0
  url   = local.github_oidc_url
}

resource "aws_iam_openid_connect_provider" "github" {
  count = var.enable_github_actions && var.create_github_oidc_provider ? 1 : 0

  url            = local.github_oidc_url
  client_id_list = ["sts.amazonaws.com"]
  # GitHub OIDC 인증서는 AWS의 신뢰 CA로 검증하므로 고정 thumbprint를 복사하지 않습니다.
}

resource "aws_iam_role" "github_deploy" {
  count = var.enable_github_actions ? 1 : 0

  name                 = "${var.project_name}-github-deploy"
  description          = "Static portfolio deployment from one GitHub repository and branch"
  max_session_duration = 3600

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Action    = "sts:AssumeRoleWithWebIdentity"
      Principal = { Federated = local.github_oidc_provider_arn }
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          "token.actions.githubusercontent.com:sub" = local.github_oidc_subject
        }
      }
    }]
  })
}

resource "aws_iam_role_policy" "github_deploy" {
  count = var.enable_github_actions ? 1 : 0

  name = "${var.project_name}-static-deploy"
  role = aws_iam_role.github_deploy[0].id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "InspectDeploymentBucket"
        Effect   = "Allow"
        Action   = ["s3:ListBucket", "s3:GetBucketPublicAccessBlock"]
        Resource = aws_s3_bucket.site.arn
      },
      {
        Sid      = "PublishStaticFiles"
        Effect   = "Allow"
        Action   = ["s3:GetObject", "s3:PutObject"]
        Resource = "${aws_s3_bucket.site.arn}/*"
      },
      {
        Sid      = "InspectAndRefreshThisDistribution"
        Effect   = "Allow"
        Action   = ["cloudfront:GetDistribution", "cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"]
        Resource = aws_cloudfront_distribution.site.arn
      }
    ]
  })
}
