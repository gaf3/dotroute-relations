ACCOUNT=gaf3
IMAGE=dotroute-relations-gui
VERSION?=dev
NAME=$(IMAGE)-$(ACCOUNT)

.PHONY: build shell push install update remove reset

build:
	docker build . --build-arg BASE=$(BASE) -t $(ACCOUNT)/$(IMAGE):$(VERSION)

shell:
	-docker run -it --rm $(ACCOUNT)/$(IMAGE):$(VERSION) sh
