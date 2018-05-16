#!/bin/bash
echo "Welcome to Sindota IoT client!"

PASS="password1"
LOGIN="admin@mail.com"
BAUD=9600

if [ -z $1 ]
then
    DEVICE="ttyUSB0"
else
    DEVICE=$1
fi

#echo $(curl --insecure -XGET https://localhost:8080/public/greeting)
JWT=$(curl --silent --insecure -XPOST https://localhost:8080/public/jwt/login -H "Content-Type: application/json" -d '{"email":"'"$LOGIN"'", "pass":"'"$PASS"'"}' | awk '{print substr($0,2,length($0)-2)}')
#echo $JWT

while true
do
    INPUT=$(cat "/dev/$DEVICE" 2> /dev/null)
    if [[ -n $INPUT ]]
    then
	echo $INPUT
	if [[ $INPUT == UPD* ]]
	then
	    echo "Telling our time"
	    echo -e -n "N$(date +%s)" > /dev/$DEVICE
	    echo "Loading tournament"
	    TOURNAMENT=$(curl --silent --insecure -XGET https://localhost:8080/private/tournament/my/selected -H "Authorization: Bearer $JWT")
	    if [[ $TOURNAMENT = 'null' ]]
	    then
		echo $TOURNAMENT
		echo "No tournaments selected"		
	    else
		TOURNAMENT_AT=$(echo $TOURNAMENT | jq -r '.at')
		TOURNAMENT_TITLE=$(echo $TOURNAMENT | jq -r '.title')
		if [[ -n $TOURNAMENT_AT ]]
		then
		    echo "Loaded $TOURNAMENT_TITLE"		
		    echo "Telling tournament time"
		    echo -e -n "T$(date -d $TOURNAMENT_AT +%s)" > /dev/$DEVICE
		else
		    echo "Cannot load tournament"
		fi
	    fi   
	    echo
	fi
    fi
    sleep 1
done

