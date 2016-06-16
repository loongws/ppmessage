.pipe(replace('{ppconsole_api_uuid}', bootstrap_data.PPCONSOLE.api_uuid))
        .pipe(replace('{ppconsole_api_key}', bootstrap_data.PPCONSOLE.api_key))
        .pipe(replace('{ppconsole_api_secret}', bootstrap_data.PPCONSOLE.api_secret))
        .pipe(replace('{ppmessage_app_uuid}', bootstrap_data.team.app_uuid))
        
