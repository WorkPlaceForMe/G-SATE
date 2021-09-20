Using TensorFlow backend.
WARNING:tensorflow:From /home/src/server/face/gender/gender.py:19: The name tf.ConfigProto is deprecated. Please use tf.compat.v1.ConfigProto instead.

WARNING:tensorflow:From /home/src/server/face/gender/gender.py:22: The name tf.Session is deprecated. Please use tf.compat.v1.Session instead.

2021-09-08 02:07:42.006159: I tensorflow/core/platform/cpu_feature_guard.cc:142] Your CPU supports instructions that this TensorFlow binary was not compiled to use: AVX2 FMA
2021-09-08 02:07:42.021971: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcuda.so.1
2021-09-08 02:07:42.023469: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x1ec74790 executing computations on platform CUDA. Devices:
2021-09-08 02:07:42.023485: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): Tesla T4, Compute Capability 7.5
2021-09-08 02:07:42.048221: I tensorflow/core/platform/profile_utils/cpu_utils.cc:94] CPU Frequency: 2445405000 Hz
2021-09-08 02:07:42.048478: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x50627990 executing computations on platform Host. Devices:
2021-09-08 02:07:42.048502: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): <undefined>, <undefined>
2021-09-08 02:07:42.049213: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-08 02:07:42.049308: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-08 02:07:42.049336: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-08 02:07:42.049407: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-08 02:07:42.050089: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-08 02:07:42.052703: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-08 02:07:42.053812: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-08 02:07:42.053868: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-08 02:07:42.055574: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-08 02:07:42.055640: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-08 02:07:42.055649: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-08 02:07:42.055655: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-08 02:07:42.056619: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 3196 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
WARNING:tensorflow:From /home/src/server/face/gender/gender.py:24: The name tf.gfile.GFile is deprecated. Please use tf.io.gfile.GFile instead.

WARNING:tensorflow:From /home/src/server/face/gender/gender.py:25: The name tf.GraphDef is deprecated. Please use tf.compat.v1.GraphDef instead.

WARNING:tensorflow:From /home/src/server/face/gender/gender.py:34: The name tf.get_default_graph is deprecated. Please use tf.compat.v1.get_default_graph instead.

2021-09-08 02:07:42.492800: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-08 02:07:42.492850: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-08 02:07:42.492865: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-08 02:07:42.492934: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-08 02:07:42.492966: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-08 02:07:42.492988: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-08 02:07:42.493007: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-08 02:07:42.493019: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-08 02:07:42.493906: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-08 02:07:42.493932: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-08 02:07:42.493939: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-08 02:07:42.493945: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-08 02:07:42.494887: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 3196 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-09-08 02:07:42.629060: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-08 02:07:42.629124: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-08 02:07:42.629138: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-08 02:07:42.629201: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-08 02:07:42.629232: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-08 02:07:42.629283: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-08 02:07:42.629307: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-08 02:07:42.629318: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-08 02:07:42.630173: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-08 02:07:42.630199: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-08 02:07:42.630206: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-08 02:07:42.630212: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-08 02:07:42.631087: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 3196 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-09-08 02:07:44.682477: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-08 02:07:44.682541: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-08 02:07:44.682556: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-08 02:07:44.682654: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-08 02:07:44.682701: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-08 02:07:44.682724: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-08 02:07:44.682744: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-08 02:07:44.682755: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-08 02:07:44.702921: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-08 02:07:44.703010: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-08 02:07:44.703020: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-08 02:07:44.703026: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-08 02:07:44.718672: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 3196 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-09-08 02:07:44.719280: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-08 02:07:44.719316: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-08 02:07:44.719329: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-08 02:07:44.719390: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-08 02:07:44.719421: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-08 02:07:44.719443: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-08 02:07:44.719462: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-08 02:07:44.719473: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-08 02:07:44.720345: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-08 02:07:44.726754: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-08 02:07:44.726829: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-08 02:07:44.726843: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-08 02:07:44.726906: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-08 02:07:44.726938: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-08 02:07:44.726960: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-08 02:07:44.726979: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-08 02:07:44.726990: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-08 02:07:44.728315: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-08 02:07:44.728347: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-08 02:07:44.728361: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-08 02:07:44.728367: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-08 02:07:44.729344: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 3196 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
Using TensorFlow backend.
WARNING:tensorflow:From /home/src/server/face/feature/get_feature.py:7: The name tf.GraphDef is deprecated. Please use tf.compat.v1.GraphDef instead.

WARNING:tensorflow:From /home/src/server/face/feature/get_feature.py:18: The name tf.ConfigProto is deprecated. Please use tf.compat.v1.ConfigProto instead.

WARNING:tensorflow:From /home/src/server/face/feature/get_feature.py:21: The name tf.Session is deprecated. Please use tf.compat.v1.Session instead.

2021-09-08 02:07:57.181336: I tensorflow/core/platform/cpu_feature_guard.cc:142] Your CPU supports instructions that this TensorFlow binary was not compiled to use: AVX2 FMA
2021-09-08 02:07:57.186499: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcuda.so.1
2021-09-08 02:07:57.209797: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x48ff2bf0 executing computations on platform CUDA. Devices:
2021-09-08 02:07:57.209862: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): Tesla T4, Compute Capability 7.5
2021-09-08 02:07:57.213406: I tensorflow/core/platform/profile_utils/cpu_utils.cc:94] CPU Frequency: 2445405000 Hz
2021-09-08 02:07:57.213744: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x5b8084e0 executing computations on platform Host. Devices:
2021-09-08 02:07:57.213763: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): <undefined>, <undefined>
2021-09-08 02:07:57.214383: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-08 02:07:57.214450: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-08 02:07:57.214490: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-08 02:07:57.214515: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-08 02:07:57.215069: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-08 02:07:57.216319: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-08 02:07:57.236581: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-08 02:07:57.236824: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-08 02:07:57.237909: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-08 02:07:57.237947: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-08 02:07:57.237956: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-08 02:07:57.237962: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-08 02:07:57.238911: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 3021 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-09-08 02:07:57.240321: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-08 02:07:57.240399: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-08 02:07:57.240429: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-08 02:07:57.240445: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-08 02:07:57.240514: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-08 02:07:57.240540: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-08 02:07:57.240564: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-08 02:07:57.240585: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-08 02:07:57.241453: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-08 02:07:57.242909: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-08 02:07:57.242956: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-08 02:07:57.242977: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-08 02:07:57.242990: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-08 02:07:57.243041: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-08 02:07:57.243064: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-08 02:07:57.243085: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-08 02:07:57.243102: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-08 02:07:57.244827: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-08 02:07:57.244862: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-08 02:07:57.244870: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-08 02:07:57.244876: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-08 02:07:57.245806: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 3021 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
