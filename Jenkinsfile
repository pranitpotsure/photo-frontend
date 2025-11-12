pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        S3_BUCKET = 'photo-frontend-pranit'
        CLOUDFRONT_ID = 'E2BPJRH3GUIOSG'
    }

    tools {
        nodejs 'nodejs'   // make sure NodeJS is configured in Jenkins (Manage Jenkins → Global Tool Configuration)
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '🔄 Cloning repository...'
                git branch: 'main', url: 'https://github.com/pranitpotsure/photo-frontend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                sh 'npm ci'
            }
        }

        stage('Build React App') {
            steps {
                echo '🏗️ Building the React app...'
                sh 'npm run build'
            }
        }

        stage('Deploy to S3') {
            steps {
                echo '☁️ Uploading build folder to S3...'
                sh '''
                    aws s3 sync build/ s3://$S3_BUCKET --delete --region $AWS_REGION
                '''
            }
        }

        stage('Invalidate CloudFront Cache') {
            steps {
                echo '🚀 Invalidating CloudFront cache...'
                sh '''
                    aws cloudfront create-invalidation \
                        --distribution-id $CLOUDFRONT_ID \
                        --paths "/*"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Frontend deployment successful!'
        }
        failure {
            echo '❌ Deployment failed. Check Jenkins logs.'
        }
    }
}
