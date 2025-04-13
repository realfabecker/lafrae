.PHONY: build
latest: build-info docker-build

.PHONY: build-info
build-info:
	$(info [INF] Creating build info file)
	rm -f build.info
	echo [build] >> build.info
	echo date=$(shell date +%FT%T) >> build.info
	echo [git] >> build.info
	echo commit=$(shell git rev-parse HEAD) >> build.info

.PHONY: docker-build
docker-build:
	$(info [INF] Building docker image)
	docker buildx build --push