BASEDIR=$(dirname "$0")
echo "$BASEDIR"

echo "$BASH_SOURCE"

function download_geolite2() 
{
    #SCRIPT=$(readlink -f "$0")
    #BASEDIR=$(dirname "${SCRIPT}")
    BASEDIR=$(dirname "$BASH_SOURCE")
    APIDIR="${BASEDIR}"/../api/geolite2
    #wget --directory-prefix="${APIDIR}" -c http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz
    GEOFILE=GeoLite2-City.mmdb.gz
    GEOPATH="${APIDIR}"/GeoLite2-City.mmdb.gz
    
    echo "${GEOPATH}"
    echo $(readlink -e "${GEOPATH}")
    AGEOPATH=$(readlink -e "${GEOPATH}")
    STEM=$(basename "${GEOFILE}" .gz)
    gunzip -c "${AGEOPATH}" > "${APIDIR}"/"${STEM}"
}
    
download_geolite2

