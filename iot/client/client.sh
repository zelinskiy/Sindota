#!/bin/bash
echo "Hello!"

PASS="password1"
LOGIN="admin@mail.com"

if [ -z $1 ]
then
    DEVICE="/dev/ttyUSB0"
else
    DEVICE=$1
fi

#echo $(curl --insecure -XGET https://localhost:8080/public/greeting)
JWT=$(curl --silent --insecure -XPOST https://localhost:8080/public/jwt/login -H "Content-Type: application/json" -d '{"email": "admin@mail.com", "pass":"password1"}' | awk '{print substr($0,2,length($0)-2)}')

while true
do
    if [[ $(ls $DEVICE) = $DEVICE ]]
    then
	INPUT=$(cat < $DEVICE)
	if [[ -n $INPUT && $INPUT = "UPD" ]]
	then
	    echo "Loading tournament"
	    TOURNAMENT=$(curl --silent --insecure -XGET https://localhost:8080/private/tournament/my/selected -H "Authorization: Bearer $JWT")
	    TOURNAMENT_AT=$(echo $TOURNAMENT | jq -r '.at')
	    TOURNAMENT_TITLE=$(echo $TOURNAMENT | jq -r '.title')
	    echo $TOURNAMENT_AT
	    
	    echo "Telling our time"
	    echo -e -n "N$(date +%s)" > $DEVICE
	    echo "Telling tournament time"
	    echo -e -n "T$(date -d $TOURNAMENT_AT +%s)" > $DEVICE
	    #echo -e -n "T1515224700" > $DEVICE
	    echo "Sleeping"
	    echo
	fi
    fi
    sleep 1
done

