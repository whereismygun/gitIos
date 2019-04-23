#!/bin/bash

echo ’build resource …’

set -v

# 编译文件
rm -rf build && mkdir -p build
react-native bundle --platform ios --entry-file index.ios.js --bundle-output build/index.jsbundle --dev false
