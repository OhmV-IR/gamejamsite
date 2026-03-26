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

        stage('Create .env file') {
            steps {
                withCredentials([
                    string(credentialsId: 'google-oauth-client-id', variable: 'GOOGLE_OAUTH_CLIENT_ID'),
                    string(credentialsId: 'google-oauth-client-secret', variable: 'GOOGLE_OAUTH_CLIENT_SECRET'),
                    string(credentialsId: 'google-oauth-redirect-url', variable: 'GOOGLE_OAUTH_REDIRECT_URL'),
                    string(credentialsId: 'github-oauth-client-id', variable: 'GITHUB_OAUTH_CLIENT_ID'),
                    string(credentialsId: 'github-oauth-client-secret', variable: 'GITHUB_OAUTH_CLIENT_SECRET'),
                    string(credentialsId: 'github-oauth-redirect-url', variable: 'GITHUB_OAUTH_REDIRECT_URL'),
                    string(credentialsId: 'discord-oauth-client-id', variable: 'DISCORD_OAUTH_CLIENT_ID'),
                    string(credentialsId: 'discord-oauth-client-secret', variable: 'DISCORD_OAUTH_CLIENT_SECRET'),
                    string(credentialsId: 'discord-oauth-redirect-url', variable: 'DISCORD_OAUTH_REDIRECT_URL'),
                    string(credentialsId: 'db-endpoint', variable: 'DB_ENDPOINT'),
                    string(credentialsId: 'db-key', variable: 'DB_KEY'),
                    string(credentialsId: 'db-id', variable: 'DB_ID'),
                    string(credentialsId: 'usercontainer-id', variable: 'USERCONTAINER_ID'),
                    string(credentialsId: 'teamscontainer-id', variable: 'TEAMSCONTAINER_ID'),
                    string(credentialsId: 'domain', variable: 'DOMAIN'),
                    string(credentialsId: 'blob-connstr', variable: 'BLOB_CONNSTR'),
                    string(credentialsId: 'cookie-secret', variable: 'COOKIE_SECRET'),
                    string(credentialsId: 'webhook-key', variable: 'WEBHOOK_KEY'),
                    string(credentialsId: 'edge-config', variable: 'EDGE_CONFIG'),
                    string(credentialsId: 'edge-config-id', variable: 'EDGE_CONFIG_ID'),
                    string(credentialsId: 'edge-config-token', variable: 'EDGE_CONFIG_TOKEN')
                ]) {
                    bat """
                        if exists .env del .env
                        echo DOTENV_CONFIG_QUIET=true > .env
                        echo GOOGLE_OAUTH_CLIENT_ID=%GOOGLE_OAUTH_CLIENT_ID%>> .env
                        echo GOOGLE_OAUTH_CLIENT_SECRET=%GOOGLE_OAUTH_CLIENT_SECRET%>> .env
                        echo GOOGLE_OAUTH_REDIRECT_URL=%GOOGLE_OAUTH_REDIRECT_URL%>> .env
                        echo GITHUB_OAUTH_CLIENT_ID=%GITHUB_OAUTH_CLIENT_ID%>> .env
                        echo GITHUB_OAUTH_CLIENT_SECRET=%GITHUB_OAUTH_CLIENT_SECRET%>> .env
                        echo GITHUB_OAUTH_REDIRECT_URL=%GITHUB_OAUTH_REDIRECT_URL%>> .env
                        echo DISCORD_OAUTH_CLIENT_ID=%DISCORD_OAUTH_CLIENT_ID%>> .env
                        echo DISCORD_OAUTH_CLIENT_SECRET=%DISCORD_OAUTH_CLIENT_SECRET%>> .env
                        echo DISCORD_OAUTH_REDIRECT_URL=%DISCORD_OAUTH_REDIRECT_URL%>> .env
                        echo DB_ENDPOINT=%DB_ENDPOINT%>> .env
                        echo DB_KEY=%DB_KEY%>> .env
                        echo DB_ID=%DB_ID%>> .env
                        echo USERCONTAINER_ID=%USERCONTAINER_ID%>> .env
                        echo TEAMSCONTAINER_ID=%TEAMSCONTAINER_ID%>> .env
                        echo DOMAIN=%DOMAIN%>> .env
                        echo BLOB_CONNSTR=%BLOB_CONNSTR%>> .env
                        echo COOKIE_SECRET=%COOKIE_SECRET%>> .env
                        echo WEBHOOK_KEY=%WEBHOOK_KEY%>> .env
                        echo EDGE_CONFIG=%EDGE_CONFIG%>> .env
                        echo EDGE_CONFIG_ID=%EDGE_CONFIG_ID%>> .env
                        echo EDGE_CONFIG_TOKEN=%EDGE_CONFIG_TOKEN%>> .env
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
