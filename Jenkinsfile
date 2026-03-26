pipeline {
    agent { label 'windows' }
    
    tools {
        nodejs 'node24'
    }
    
    environment {
        NODE_ENV = 'production'
    }
    
    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }
        
        stage("deps"){
            steps {
                bat "npm install"
            }
        }
        
        stage("build"){
            steps {
                bat "npm run build"
            }
        }

        stage("lint"){
            steps {
                bat "npm run lint"
            }
        }
        
        stage("archive"){
            steps {
                archiveArtifacts artifacts: 'build/**', fingerprint: true
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
