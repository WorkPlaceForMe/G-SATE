Using TensorFlow backend.
WARNING:tensorflow:From /home/src/server/face/gender/gender.py:19: The name tf.ConfigProto is deprecated. Please use tf.compat.v1.ConfigProto instead.

WARNING:tensorflow:From /home/src/server/face/gender/gender.py:22: The name tf.Session is deprecated. Please use tf.compat.v1.Session instead.

2021-09-06 02:06:10.969505: I tensorflow/core/platform/cpu_feature_guard.cc:142] Your CPU supports instructions that this TensorFlow binary was not compiled to use: AVX2 FMA
2021-09-06 02:06:11.003083: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcuda.so.1
2021-09-06 02:06:11.032097: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x32046aa0 executing computations on platform CUDA. Devices:
2021-09-06 02:06:11.032149: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): Tesla T4, Compute Capability 7.5
2021-09-06 02:06:11.201575: I tensorflow/core/platform/profile_utils/cpu_utils.cc:94] CPU Frequency: 2445410000 Hz
2021-09-06 02:06:11.202027: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x4ebd83a0 executing computations on platform Host. Devices:
2021-09-06 02:06:11.202049: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): <undefined>, <undefined>
2021-09-06 02:06:11.202872: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-06 02:06:11.202926: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-06 02:06:11.202952: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-06 02:06:11.203029: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-06 02:06:11.203497: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-06 02:06:11.588175: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-06 02:06:11.797597: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-06 02:06:11.797743: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-06 02:06:11.798657: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-06 02:06:11.798690: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-06 02:06:11.798699: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-06 02:06:11.798705: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-06 02:06:11.809182: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 1025 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
WARNING:tensorflow:From /home/src/server/face/gender/gender.py:24: The name tf.gfile.GFile is deprecated. Please use tf.io.gfile.GFile instead.

WARNING:tensorflow:From /home/src/server/face/gender/gender.py:25: The name tf.GraphDef is deprecated. Please use tf.compat.v1.GraphDef instead.

WARNING:tensorflow:From /home/src/server/face/gender/gender.py:34: The name tf.get_default_graph is deprecated. Please use tf.compat.v1.get_default_graph instead.

2021-09-06 02:06:12.202589: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-06 02:06:12.202650: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-06 02:06:12.202664: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-06 02:06:12.202735: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-06 02:06:12.202767: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-06 02:06:12.202790: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-06 02:06:12.202812: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-06 02:06:12.202823: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-06 02:06:12.203575: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-06 02:06:12.203602: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-06 02:06:12.203610: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-06 02:06:12.203616: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-06 02:06:12.204576: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 1025 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-09-06 02:06:12.447870: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-06 02:06:12.447934: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-06 02:06:12.447950: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-06 02:06:12.448018: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-06 02:06:12.448077: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-06 02:06:12.448106: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-06 02:06:12.448131: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-06 02:06:12.448143: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-06 02:06:12.448851: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-06 02:06:12.448876: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-06 02:06:12.448883: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-06 02:06:12.448889: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-06 02:06:12.449624: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 1025 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
Using TensorFlow backend.
WARNING:tensorflow:From /home/src/server/face/feature/get_feature.py:7: The name tf.GraphDef is deprecated. Please use tf.compat.v1.GraphDef instead.

2021-09-06 02:06:19.093304: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-06 02:06:19.093375: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-06 02:06:19.093390: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-06 02:06:19.093469: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-06 02:06:19.093506: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-06 02:06:19.093530: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-06 02:06:19.093553: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-06 02:06:19.093564: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-06 02:06:19.094364: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-06 02:06:19.094390: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-06 02:06:19.094397: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-06 02:06:19.094403: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-06 02:06:19.095152: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 1025 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-09-06 02:06:19.095619: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-06 02:06:19.095640: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-06 02:06:19.095652: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-06 02:06:19.095670: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-06 02:06:19.095691: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-06 02:06:19.095711: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-06 02:06:19.095730: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-06 02:06:19.095740: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-06 02:06:19.096592: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-06 02:06:19.097470: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-06 02:06:19.097494: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-06 02:06:19.097505: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-06 02:06:19.097525: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-06 02:06:19.097547: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-06 02:06:19.097567: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-06 02:06:19.097585: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-06 02:06:19.097595: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-06 02:06:19.098307: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-06 02:06:19.098324: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-06 02:06:19.098330: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-06 02:06:19.098335: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-06 02:06:19.099091: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 1025 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
WARNING:tensorflow:From /home/src/server/face/feature/get_feature.py:18: The name tf.ConfigProto is deprecated. Please use tf.compat.v1.ConfigProto instead.

WARNING:tensorflow:From /home/src/server/face/feature/get_feature.py:21: The name tf.Session is deprecated. Please use tf.compat.v1.Session instead.

2021-09-06 02:06:19.173558: I tensorflow/core/platform/cpu_feature_guard.cc:142] Your CPU supports instructions that this TensorFlow binary was not compiled to use: AVX2 FMA
2021-09-06 02:06:19.178458: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcuda.so.1
2021-09-06 02:06:19.179439: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x4ad64cd0 executing computations on platform CUDA. Devices:
2021-09-06 02:06:19.179454: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): Tesla T4, Compute Capability 7.5
2021-09-06 02:06:19.180990: I tensorflow/core/platform/profile_utils/cpu_utils.cc:94] CPU Frequency: 2445410000 Hz
2021-09-06 02:06:19.181257: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x5c3c4fd0 executing computations on platform Host. Devices:
2021-09-06 02:06:19.181268: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): <undefined>, <undefined>
2021-09-06 02:06:19.181708: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-06 02:06:19.181755: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-06 02:06:19.181789: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-06 02:06:19.181816: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-06 02:06:19.182118: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-06 02:06:19.183173: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-06 02:06:19.183986: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-06 02:06:19.184082: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-06 02:06:19.184911: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-06 02:06:19.184939: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-06 02:06:19.184947: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-06 02:06:19.184953: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-06 02:06:19.185736: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 3021 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-09-06 02:06:19.186826: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-06 02:06:19.186863: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-06 02:06:19.186881: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-06 02:06:19.186894: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-06 02:06:19.186922: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-06 02:06:19.186949: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-06 02:06:19.186974: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-06 02:06:19.186994: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-06 02:06:19.187707: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-06 02:06:19.188759: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-06 02:06:19.188786: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-06 02:06:19.188802: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-06 02:06:19.188816: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-06 02:06:19.188841: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-06 02:06:19.188867: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-06 02:06:19.188891: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-06 02:06:19.188911: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-06 02:06:19.189687: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-06 02:06:19.189706: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-06 02:06:19.189713: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-06 02:06:19.189718: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-06 02:06:19.190909: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 3021 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-09-06 02:06:23.601162: E tensorflow/stream_executor/cuda/cuda_driver.cc:828] failed to allocate 2.95G (3168744192 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-09-06 02:06:23.602066: E tensorflow/stream_executor/cuda/cuda_driver.cc:828] failed to allocate 2.66G (2851869696 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-09-06 02:06:23.602803: E tensorflow/stream_executor/cuda/cuda_driver.cc:828] failed to allocate 2.39G (2566682624 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-09-06 02:06:23.609192: E tensorflow/stream_executor/cuda/cuda_driver.cc:828] failed to allocate 2.15G (2310014208 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-09-06 02:06:23.609964: E tensorflow/stream_executor/cuda/cuda_driver.cc:828] failed to allocate 1.94G (2079012864 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-09-06 02:06:23.610711: E tensorflow/stream_executor/cuda/cuda_driver.cc:828] failed to allocate 1.74G (1871111680 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-09-06 02:06:23.611464: E tensorflow/stream_executor/cuda/cuda_driver.cc:828] failed to allocate 1.57G (1684000512 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-09-06 02:06:23.612243: E tensorflow/stream_executor/cuda/cuda_driver.cc:828] failed to allocate 1.41G (1515600384 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-09-06 02:06:23.612996: E tensorflow/stream_executor/cuda/cuda_driver.cc:828] failed to allocate 1.27G (1364040448 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-09-06 02:06:32.747803: F tensorflow/stream_executor/cuda/cuda_driver.cc:175] Check failed: err == cudaSuccess || err == cudaErrorInvalidValue Unexpected CUDA error: out of memory
/home/src/server/run.sh: line 8:    32 Aborted                 (core dumped) python3 run2.py
