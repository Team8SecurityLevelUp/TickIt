terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {        
    region         = "af-south-1"
  }
}

provider "aws" {
  region =  "af-south-1"
}

resource "aws_default_vpc" "default_vpc" {
  tags = {
    Name = "default_vpc"
  }
}

data "aws_availability_zones" "available_zones" {
  
}

resource "aws_default_subnet" "subnet_az1" {
  availability_zone = data.aws_availability_zones.available_zones.names[0]
}

resource "aws_default_subnet" "subnet_az2" {
  availability_zone = data.aws_availability_zones.available_zones.names[1]
}

resource "aws_security_group" "allow_postgres" {
  name_prefix = "allow_postgres_"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  //change to only allow connections from EC2
    /* 
     ingress {
      from_port       = 5432
      to_port         = 5432
      protocol        = "tcp"
      security_groups = [aws_security_group.ec2_security_group.id]
    }

    egress {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
    */
  }
}

data "aws_secretsmanager_secret_version" "postgresuser" {
  secret_id = "postgresuser"
}

data "aws_secretsmanager_secret_version" "postgrespass" {
  secret_id = "postgrespass"
}

resource "aws_db_instance" "tickitdb" {
  identifier             = "tickitdb"
  engine                 = "postgres"
  engine_version         = "16.4"
  instance_class         = "db.t4g.micro"
  db_name                = "tickitdb"
  allocated_storage      = 20
  storage_type           = "gp2"
  publicly_accessible    = true
  username               = data.aws_secretsmanager_secret_version.postgresuser.secret_string
  password               = data.aws_secretsmanager_secret_version.postgrespass.secret_string
  skip_final_snapshot    = true
  vpc_security_group_ids = [aws_security_group.allow_postgres.id]
  tags = {
    Name = "tickitdb"
  }
}

output "db_host" {
  value = aws_db_instance.tickitdb.endpoint
  description = "The endpoint of the Postgres Server RDS instance"
}


resource "aws_security_group" "ec2_security_group" {
  name_prefix = "tickit_api_sg"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "tickit_ec2_instance" {
  ami           = "ami-0b7e05c6022fc830b"
  instance_type = "t3.micro"
  key_name      = "tickit-key"
  tags = {
    Name = "tickit_ec2_instance"
  }

  vpc_security_group_ids = [ aws_security_group.ec2_security_group.id ]
}

resource "aws_budgets_budget" "team_8_budget" {
  name              = "team_8_budget"
  budget_type       = "COST"
  limit_amount      = "50"
  limit_unit        = "USD"
  time_period_end   = "2025-06-14_00:00"
  time_period_start = "2025-06-02_00:00"
  time_unit         = "MONTHLY"

  notification {
    comparison_operator        = "EQUAL_TO"
    threshold                  = 50
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = ["shashin.gounden@bbd.co.za", "Mnqobi.Nkabinde@bbd.co.za", "Lerato.Taunyane@bbd.co.za", "lindiwe@bbd.co.za", "rudolphe@bbdsoftware.com"]
  }

  notification {
    comparison_operator        = "EQUAL_TO"
    threshold                  = 75
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = ["shashin.gounden@bbd.co.za", "Mnqobi.Nkabinde@bbd.co.za", "Lerato.Taunyane@bbd.co.za", "lindiwe@bbd.co.za", "rudolphe@bbdsoftware.com"]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 10
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [
      "shashin.gounden@bbd.co.za",
      "Mnqobi.Nkabinde@bbd.co.za",
      "Lerato.Taunyane@bbd.co.za",
      "lindiwe@bbd.co.za",
      "rudolphe@bbdsoftware.com"
    ]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 20
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [
      "shashin.gounden@bbd.co.za",
      "Mnqobi.Nkabinde@bbd.co.za",
      "Lerato.Taunyane@bbd.co.za",
      "lindiwe@bbd.co.za",
      "rudolphe@bbdsoftware.com"
    ]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 30
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [
      "shashin.gounden@bbd.co.za",
      "Mnqobi.Nkabinde@bbd.co.za",
      "Lerato.Taunyane@bbd.co.za",
      "lindiwe@bbd.co.za",
      "rudolphe@bbdsoftware.com"
    ]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 40
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [
      "shashin.gounden@bbd.co.za",
      "Mnqobi.Nkabinde@bbd.co.za",
      "Lerato.Taunyane@bbd.co.za",
      "lindiwe@bbd.co.za",
      "rudolphe@bbdsoftware.com"
    ]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 50
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [
      "shashin.gounden@bbd.co.za",
      "Mnqobi.Nkabinde@bbd.co.za",
      "Lerato.Taunyane@bbd.co.za",
      "lindiwe@bbd.co.za",
      "rudolphe@bbdsoftware.com"
    ]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 60
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [
      "shashin.gounden@bbd.co.za",
      "Mnqobi.Nkabinde@bbd.co.za",
      "Lerato.Taunyane@bbd.co.za",
      "lindiwe@bbd.co.za",
      "rudolphe@bbdsoftware.com"
    ]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 70
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [
      "shashin.gounden@bbd.co.za",
      "Mnqobi.Nkabinde@bbd.co.za",
      "Lerato.Taunyane@bbd.co.za",
      "lindiwe@bbd.co.za",
      "rudolphe@bbdsoftware.com"
    ]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [
      "shashin.gounden@bbd.co.za",
      "Mnqobi.Nkabinde@bbd.co.za",
      "Lerato.Taunyane@bbd.co.za",
      "lindiwe@bbd.co.za",
      "rudolphe@bbdsoftware.com"
    ]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 90
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [
      "shashin.gounden@bbd.co.za",
      "Mnqobi.Nkabinde@bbd.co.za",
      "Lerato.Taunyane@bbd.co.za",
      "lindiwe@bbd.co.za",
      "rudolphe@bbdsoftware.com"
    ]
  }

  notification {
    comparison_operator        = "EQUAL_TO"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [
      "shashin.gounden@bbd.co.za",
      "Mnqobi.Nkabinde@bbd.co.za",
      "Lerato.Taunyane@bbd.co.za",
      "lindiwe@bbd.co.za",
      "rudolphe@bbdsoftware.com"
    ]
  }
}

resource "aws_eip" "tickit_ec2_eip" {
  instance = aws_instance.tickit_ec2_instance.id
  domain   = "vpc"
}

output "ec2_host" {
  value = aws_eip.tickit_ec2_eip.public_dns
  description = "The endpoint of the EC2 instance"
}