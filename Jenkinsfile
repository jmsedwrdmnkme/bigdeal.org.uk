pipeline {
  agent any

  stages {
    stage('Npm install') {
      steps {
        sh 'npm i'
      }
    }
    stage('Gulp build') {
      steps {
        sh 'gulp build'
      }
    }
    stage('Deploy') {
      steps {
        sshPublisher(
          publishers: [
            sshPublisherDesc(
              configName: 'Lightsail AWS (Synthetic)',
              transfers: [
                sshTransfer(
                  cleanRemote: false,
                  excludes: '',
                  execCommand: 'rm -rf *',
                  execTimeout: 120000,
                  flatten: false,
                  makeEmptyDirs: false,
                  noDefaultExcludes: false,
                  patternSeparator: '[, ]+',
                  remoteDirectory: '',
                  remoteDirectorySDF: false,
                  removePrefix: '',
                  sourceFiles: ''
                ),
                sshTransfer(
                  cleanRemote: false,
                  excludes: '',
                  execCommand: '',
                  execTimeout: 120000,
                  flatten: false,
                  makeEmptyDirs: false,
                  noDefaultExcludes: false,
                  patternSeparator: '[, ]+',
                  remoteDirectory: '',
                  remoteDirectorySDF: false,
                  removePrefix: 'dist',
                  sourceFiles: 'dist/**/*'
                )
              ],
              usePromotionTimestamp: false,
              useWorkspaceInPromotion: false,
              verbose: true
            )
          ]
        )
      }
    }
  }
}
