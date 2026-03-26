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

        stage("create .env"){
            steps {
                withCredentials([
            string(credentialsId: 'BLOB_CONNSTR', variable: 'BLOB_CONNSTR'),
            string(credentialsId: 'COOKIE_SECRET', variable: 'COOKIE_SECRET'),
            string(credentialsId: 'DB_ENDPOINT', variable: 'DB_ENDPOINT'),
            string(credentialsId: 'DB_ID', variable: 'DB_ID'),
            string(credentialsId: 'DB_KEY', variable: 'DB_KEY'),
            string(credentialsId: 'DISCORD_OAUTH_CLIENT_ID', variable: 'DISCORD_OAUTH_CLIENT_ID'),
            string(credentialsId: 'DISCORD_OAUTH_CLIENT_SECRET', variable: 'DISCORD_OAUTH_CLIENT_SECRET'),
            string(credentialsId: 'DISCORD_OAUTH_REDIRECT_URL', variable: 'DISCORD_OAUTH_REDIRECT_URL'),
            string(credentialsId: 'DOMAIN', variable: 'DOMAIN'),
            string(credentialsId: 'EDGE_CONFIG', variable: 'EDGE_CONFIG'),
            string(credentialsId: 'EDGE_CONFIG_ID', variable: 'EDGE_CONFIG_ID'),
            string(credentialsId: 'EDGE_CONFIG_TOKEN', variable: 'EDGE_CONFIG_TOKEN'),
            string(credentialsId: 'GH_OAUTH_CLIENT_ID', variable: 'GH_OAUTH_CLIENT_ID'),
            string(credentialsId: 'GH_OAUTH_CLIENT_SECRET', variable: 'GH_OAUTH_CLIENT_SECRET'),
            string(credentialsId: 'GH_OAUTH_REDIRECT_URL', variable: 'GH_OAUTH_REDIRECT_URL'),
            string(credentialsId: 'GOOGLE_OAUTH_CLIENT_ID', variable: 'GOOGLE_OAUTH_CLIENT_ID'),
            string(credentialsId: 'GOOGLE_OAUTH_CLIENT_SECRET', variable: 'GOOGLE_OAUTH_CLIENT_SECRET'),
            string(credentialsId: 'GOOGLE_OAUTH_REDIRECT_URL', variable: 'GOOGLE_OAUTH_REDIRECT_URL'),
            string(credentialsId: 'TEAMSCONTAINER_ID', variable: 'TEAMSCONTAINER_ID'),
            string(credentialsId: 'USERCONTAINER_ID', variable: 'USERCONTAINER_ID'),
            string(credentialsId: 'WEBHOOK_KEY', variable: 'WEBHOOK_KEY')
            ]) {
                bat """
                    if exist .env del .env

                    echo DOTENV_CONFIG_QUIET=true>> .env
                    echo BLOB_CONNSTR=%BLOB_CONNSTR%>> .env
                    echo COOKIE_SECRET=%COOKIE_SECRET%>> .env
                    echo DB_ENDPOINT=%DB_ENDPOINT%>> .env
                    echo DB_ID=%DB_ID%>> .env
                    echo DB_KEY=%DB_KEY%>> .env

                    echo DISCORD_OAUTH_CLIENT_ID=%DISCORD_OAUTH_CLIENT_ID%>> .env
                    echo DISCORD_OAUTH_CLIENT_SECRET=%DISCORD_OAUTH_CLIENT_SECRET%>> .env
                    echo DISCORD_OAUTH_REDIRECT_URL=%DISCORD_OAUTH_REDIRECT_URL%>> .env

                    echo DOMAIN=%DOMAIN%>> .env

                    echo EDGE_CONFIG=%EDGE_CONFIG%>> .env
                    echo EDGE_CONFIG_ID=%EDGE_CONFIG_ID%>> .env
                    echo EDGE_CONFIG_TOKEN=%EDGE_CONFIG_TOKEN%>> .env

                    echo GH_OAUTH_CLIENT_ID=%GH_OAUTH_CLIENT_ID%>> .env
                    echo GH_OAUTH_CLIENT_SECRET=%GH_OAUTH_CLIENT_SECRET%>> .env
                    echo GH_OAUTH_REDIRECT_URL=%GH_OAUTH_REDIRECT_URL%>> .env

                    echo GOOGLE_OAUTH_CLIENT_ID=%GOOGLE_OAUTH_CLIENT_ID%>> .env
                    echo GOOGLE_OAUTH_CLIENT_SECRET=%GOOGLE_OAUTH_CLIENT_SECRET%>> .env
                    echo GOOGLE_OAUTH_REDIRECT_URL=%GOOGLE_OAUTH_REDIRECT_URL%>> .env

                    echo TEAMSCONTAINER_ID=%TEAMSCONTAINER_ID%>> .env
                    echo USERCONTAINER_ID=%USERCONTAINER_ID%>> .env

                    echo WEBHOOK_KEY=%WEBHOOK_KEY%>> .env
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
