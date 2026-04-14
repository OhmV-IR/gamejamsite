pipeline {
    agent { label 'windows' }
    
    tools {
        nodejs 'node24'
    }
    
    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }
        
        stage("deps"){
            steps {
                bat "npm ci"
            }
        }

        stage("create .env"){
            steps {
                withCredentials([
                    file(credentialsId: 'ENV_FILE', variable: 'ENV_FILE')
            ]) {
                bat """
                    if exist .env del .env
                    copy ${ENV_FILE} .env
                """
            }
            }
        }
        
        stage("build"){
            steps {
                bat "npm run build"
            }
        }

        stage("lint"){
            steps {
                bat "npx eslint ."
            }
        }
        
        stage("archive"){
            steps {
                archiveArtifacts artifacts: '.next/**', fingerprint: true
            }
        }
    }
    
    post {
        success {
            echo "ran successfully"
        }
        failure {
            echo "pipeline fail"
        }
    }
}
