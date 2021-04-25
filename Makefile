VERSION?=0.1.0
INSTALL=python:3.8.5-alpine3.12
TILT_PORT=6850
.PHONY: up down tag untag

up:
	kubectx docker-desktop
	tilt --port $(TILT_PORT) up

down:
	kubectx docker-desktop
	tilt down

tag:
	-git tag -a $(VERSION) -m "Version $(VERSION)"
	git push origin --tags

untag:
	-git tag -d $(VERSION)
	git push origin ":refs/tags/$(VERSION)"
