Service.$language = ( function() {

    var _DEFAULT = 'en',
        _language = _DEFAULT;

    return {
        getLanguage: getLanguage,
        setLanguage: setLanguage
    }
    
    function getLanguage() {
        return _language;
    }

    function setLanguage( language ) {
        if (language) {
            language = language.toLowerCase();
        }
        switch(language) {
        case 'zh':
        case 'zh-cn':
        case 'zh-hk':
        case 'zh-tw':
        case 'zh-sg':
            _language = 'zh-CN';
            break;

        case 'en':
        case 'en-us':
            _language = 'en';
            break;

        default:
            _language = _DEFAULT;
            break;
        }
    }
    
} )();
