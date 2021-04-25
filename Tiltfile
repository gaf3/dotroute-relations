k8s_yaml(kustomize('kubernetes/tilt'))

# api

docker_build('dotroute-relations-api', './api')

k8s_resource('api', port_forwards=['16882:80', '16850:5678'])

# gui

docker_build('dotroute-relations-gui', './gui')
k8s_resource('gui', port_forwards=['6882:80'], resource_deps=['api'])
