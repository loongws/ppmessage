BASEDIR=$(dirname "$0")
echo "$BASEDIR"


function download_geolite2() 
{
    SCRIPT=$(readlink -f "$0")
    BASEDIR=$(dirname "${SCRIPT}")
    APIDIR="${BASEDIR}"/../api/geolite2
    wget --directory-prefix="${APIDIR}" -c http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz
    GEOFILE=GeoLite2-City.mmdb.gz
    GEOPATH="${APIDIR}"/GeoLite2-City.mmdb.gz
    STEM=$(basename "${GEOFILE}" .gz)
    gunzip -c "${GEOPATH}" > /"${APIDIR}"/"${STEM}"
}
    
download_geolite2

