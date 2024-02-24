deploy:
	npm run build
	rsync -a ./.output/* root@159.223.88.250:/root/pupr-nuxt
	ssh root@159.223.88.250 "pm2 restart pupr-nuxt"
build:
	export NODE_OPTIONS=--max-old-space-size=16384
	npm run build
up:
	rsync -a ./.output/* root@159.223.88.250:/root/pupr-nuxt
	ssh root@159.223.88.250 "pm2 restart pupr-nuxt"
# make http api=testApi
# make http api=testOptApi
http:
	./dulgen -a http -n ${api}
winhttp:
	./dulgen-win -a http -n ${api}

# make backoffice page=testPage api=testApi oapi=testOptApi
backoffice:
	./dulgen -a backoffice -n ${page} -h ${api} -o ${oapi}
winbackoffice:
	./dulgen-win -a backoffice -n ${page} -h ${api} -o ${oapi}


# make academic page=testPage api=testApi oapi=testOptApi
academic:
	./dulgen -a academic -n ${page} -h ${api} -o ${oapi}
winacademic:
	./dulgen-win -a academic -n ${page} -h ${api} -o ${oapi}