variable "aws_profile" {
  description = "사용할 로컬 AWS CLI 프로필. 인증 키는 파일에 작성하지 않습니다."
  type        = string
  default     = "default"
}

variable "aws_region" {
  description = "S3와 애플리케이션 배포는 서울 리전을 사용합니다. ACM은 별칭 제공자로 분리합니다."
  type        = string
  default     = "ap-northeast-2"

  validation {
    condition     = var.aws_region == "ap-northeast-2"
    error_message = "S3와 배포 리전은 서울(ap-northeast-2)로 지정하세요. ACM은 별도로 us-east-1을 사용합니다."
  }
}

variable "expected_account_id" {
  description = "의도한 AWS 계정 ID. 다른 계정에서의 실행을 막는 용도입니다."
  type        = string

  validation {
    condition     = can(regex("^[0-9]{12}$", var.expected_account_id))
    error_message = "AWS 계정 ID는 숫자 12자리여야 합니다."
  }
}

variable "project_name" {
  description = "리소스 이름과 비용 구분 태그에 사용할 이름입니다."
  type        = string
  default     = "son-jongin-portfolio"

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{2,23}$", var.project_name))
    error_message = "프로젝트 이름은 소문자로 시작하는 3~24자의 소문자/숫자/하이픈이어야 합니다."
  }
}

variable "domain_name" {
  description = "가비아 DNS에서 CNAME으로 연결할 도메인입니다. 기본 주소만 사용하려면 빈 문자열로 둡니다."
  type        = string
  default     = "www.son-portfolio.site"

  validation {
    condition     = var.domain_name == "" || can(regex("^([a-z0-9]([a-z0-9-]*[a-z0-9])?\\.)+[a-z]{2,63}$", var.domain_name))
    error_message = "도메인은 https:// 없이 소문자 전체 주소로 입력하세요."
  }
}

variable "request_certificate" {
  description = "도메인 소유권 검증용 ACM 인증서만 먼저 요청합니다. DNS 등록은 가비아에서 직접 합니다."
  type        = bool
  default     = false

  validation {
    condition     = !var.request_certificate || var.domain_name != ""
    error_message = "인증서를 요청하려면 domain_name을 지정해야 합니다."
  }
}

variable "enable_custom_domain" {
  description = "가비아에 인증 CNAME을 등록하고 ACM이 ISSUED가 된 뒤 true로 변경합니다."
  type        = bool
  default     = false

  validation {
    condition     = !var.enable_custom_domain || (var.request_certificate && var.domain_name != "")
    error_message = "도메인 연결에는 domain_name과 request_certificate = true가 필요합니다."
  }
}

variable "force_destroy_bucket" {
  description = "버킷 안의 파일까지 삭제할 수 있게 할지 여부. 기본값은 데이터 보호를 위해 false입니다."
  type        = bool
  default     = false
}

variable "enable_github_actions" {
  description = "검토 후 활성화할 GitHub OIDC 배포 역할입니다. 파일 작성 단계의 기본값은 false입니다."
  type        = bool
  default     = false
}

variable "github_repository" {
  description = "배포를 허용할 정확한 GitHub owner/repository입니다. .git 접미사는 제외합니다."
  type        = string
  default     = "Son-github/portfolio"

  validation {
    condition     = can(regex("^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$", var.github_repository))
    error_message = "GitHub 저장소는 owner/repository 형식으로 지정하세요."
  }
}

variable "github_deploy_branch" {
  description = "OIDC 인증을 허용하는 단일 브랜치입니다. 변경 시 워크플로와 배포 스크립트도 함께 수정하세요."
  type        = string
  default     = "main"

  validation {
    condition     = can(regex("^[A-Za-z0-9][A-Za-z0-9._/-]*$", var.github_deploy_branch))
    error_message = "브랜치 이름을 지정하세요. 와일드카드는 허용하지 않습니다."
  }
}

variable "create_github_oidc_provider" {
  description = "계정에 GitHub OIDC 제공자가 없을 때만 true로 지정합니다. false이면 기존 제공자를 읽어 재사용합니다."
  type        = bool
  default     = false
}
