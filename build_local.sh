#!/bin/bash


echo 'build local'

sh build.sh

echo 'distribute files …'

set -v

# 分发文件
for app in ios
do
  rm -rf $app/Staging/rn/*
  rm -rf $app/Classes/index.jsbundle
  rm -rf $app/Classes/index.jsbundle.meta
  cp -R assets $app/Staging/rn/
  cp build/index.jsbundle $app/Classes/index.jsbundle
  cp build/index.jsbundle.meta $app/Classes/index.jsbundle.meta
done