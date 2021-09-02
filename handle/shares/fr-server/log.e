Using TensorFlow backend.
WARNING:tensorflow:From /home/src/server/face/gender/gender.py:19: The name tf.ConfigProto is deprecated. Please use tf.compat.v1.ConfigProto instead.

WARNING:tensorflow:From /home/src/server/face/gender/gender.py:22: The name tf.Session is deprecated. Please use tf.compat.v1.Session instead.

2021-09-02 07:14:14.050387: I tensorflow/core/platform/cpu_feature_guard.cc:142] Your CPU supports instructions that this TensorFlow binary was not compiled to use: AVX2 FMA
2021-09-02 07:14:14.104756: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcuda.so.1
2021-09-02 07:14:14.127820: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x3dcc9f90 executing computations on platform CUDA. Devices:
2021-09-02 07:14:14.127869: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): Tesla T4, Compute Capability 7.5
2021-09-02 07:14:14.272281: I tensorflow/core/platform/profile_utils/cpu_utils.cc:94] CPU Frequency: 2445405000 Hz
2021-09-02 07:14:14.272708: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x4f5bcd10 executing computations on platform Host. Devices:
2021-09-02 07:14:14.272724: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): <undefined>, <undefined>
2021-09-02 07:14:14.273606: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-02 07:14:14.273692: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-02 07:14:14.273720: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-02 07:14:14.273800: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-02 07:14:14.274365: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-02 07:14:14.616553: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-02 07:14:14.818605: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-02 07:14:14.818758: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-02 07:14:14.820408: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-02 07:14:14.820444: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-02 07:14:14.820453: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-02 07:14:14.820460: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-02 07:14:14.831793: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 7896 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
WARNING:tensorflow:From /home/src/server/face/gender/gender.py:24: The name tf.gfile.GFile is deprecated. Please use tf.io.gfile.GFile instead.

WARNING:tensorflow:From /home/src/server/face/gender/gender.py:25: The name tf.GraphDef is deprecated. Please use tf.compat.v1.GraphDef instead.

WARNING:tensorflow:From /home/src/server/face/gender/gender.py:34: The name tf.get_default_graph is deprecated. Please use tf.compat.v1.get_default_graph instead.

2021-09-02 07:14:15.323370: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-02 07:14:15.323435: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-02 07:14:15.323450: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-02 07:14:15.323526: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-02 07:14:15.323559: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-02 07:14:15.323582: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-02 07:14:15.323602: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-02 07:14:15.323615: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-02 07:14:15.327199: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-02 07:14:15.327252: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-02 07:14:15.327261: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-02 07:14:15.327267: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-02 07:14:15.328803: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 7896 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-09-02 07:14:15.591808: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-02 07:14:15.591938: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-02 07:14:15.591953: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-02 07:14:15.592018: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-02 07:14:15.592057: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-02 07:14:15.592080: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-02 07:14:15.592101: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-02 07:14:15.592112: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-02 07:14:15.597564: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-02 07:14:15.597607: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-02 07:14:15.597617: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-02 07:14:15.597623: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-02 07:14:15.598997: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 7896 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-09-02 07:14:21.552422: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-02 07:14:21.552560: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-02 07:14:21.552584: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-02 07:14:21.552648: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-02 07:14:21.552691: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-02 07:14:21.552714: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-02 07:14:21.552735: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-02 07:14:21.552746: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-02 07:14:21.553911: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-02 07:14:21.553937: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-02 07:14:21.553945: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-02 07:14:21.553951: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-02 07:14:21.555054: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 7896 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-09-02 07:14:21.555936: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-02 07:14:21.555958: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-02 07:14:21.555969: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-02 07:14:21.555989: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-02 07:14:21.556013: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-02 07:14:21.556035: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-02 07:14:21.556055: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-02 07:14:21.556066: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-02 07:14:21.565629: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-02 07:14:21.567068: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-02 07:14:21.567113: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-02 07:14:21.567128: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-02 07:14:21.567200: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-02 07:14:21.567239: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-02 07:14:21.567267: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-02 07:14:21.567292: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-02 07:14:21.567304: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-02 07:14:21.584642: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-02 07:14:21.584715: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-02 07:14:21.584736: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-02 07:14:21.584743: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-02 07:14:21.597963: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 7896 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
Using TensorFlow backend.
WARNING:tensorflow:From /home/src/server/face/feature/get_feature.py:7: The name tf.GraphDef is deprecated. Please use tf.compat.v1.GraphDef instead.

WARNING:tensorflow:From /home/src/server/face/feature/get_feature.py:18: The name tf.ConfigProto is deprecated. Please use tf.compat.v1.ConfigProto instead.

WARNING:tensorflow:From /home/src/server/face/feature/get_feature.py:21: The name tf.Session is deprecated. Please use tf.compat.v1.Session instead.

2021-09-02 07:14:28.717667: I tensorflow/core/platform/cpu_feature_guard.cc:142] Your CPU supports instructions that this TensorFlow binary was not compiled to use: AVX2 FMA
2021-09-02 07:14:28.723341: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcuda.so.1
2021-09-02 07:14:28.724830: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x2f3219e0 executing computations on platform CUDA. Devices:
2021-09-02 07:14:28.724850: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): Tesla T4, Compute Capability 7.5
2021-09-02 07:14:28.726798: I tensorflow/core/platform/profile_utils/cpu_utils.cc:94] CPU Frequency: 2445405000 Hz
2021-09-02 07:14:28.727120: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x5c1f9a70 executing computations on platform Host. Devices:
2021-09-02 07:14:28.727133: I tensorflow/compiler/xla/service/service.cc:175]   StreamExecutor device (0): <undefined>, <undefined>
2021-09-02 07:14:28.727903: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-02 07:14:28.727979: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-02 07:14:28.728024: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-02 07:14:28.728056: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-02 07:14:28.732717: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-02 07:14:28.734165: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-02 07:14:28.735183: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-02 07:14:28.735301: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-02 07:14:28.736956: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-02 07:14:28.737006: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-02 07:14:28.737016: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-02 07:14:28.737022: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-02 07:14:28.738204: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 3225 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-09-02 07:14:28.739243: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-02 07:14:28.739303: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-02 07:14:28.739333: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-02 07:14:28.739346: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-02 07:14:28.739411: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-02 07:14:28.739438: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-02 07:14:28.739462: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-02 07:14:28.739481: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-02 07:14:28.740584: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-02 07:14:28.741888: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1640] Found device 0 with properties: 
name: Tesla T4 major: 7 minor: 5 memoryClockRate(GHz): 1.59
pciBusID: 0001:00:00.0
2021-09-02 07:14:28.741919: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudart.so.10.0
2021-09-02 07:14:28.741936: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcublas.so.10.0
2021-09-02 07:14:28.741949: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcufft.so.10.0
2021-09-02 07:14:28.741977: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcurand.so.10.0
2021-09-02 07:14:28.742000: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusolver.so.10.0
2021-09-02 07:14:28.742020: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcusparse.so.10.0
2021-09-02 07:14:28.742037: I tensorflow/stream_executor/platform/default/dso_loader.cc:42] Successfully opened dynamic library libcudnn.so.7
2021-09-02 07:14:28.743183: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1763] Adding visible gpu devices: 0
2021-09-02 07:14:28.743207: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1181] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-09-02 07:14:28.743214: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1187]      0 
2021-09-02 07:14:28.743220: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1200] 0:   N 
2021-09-02 07:14:28.744325: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1326] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 3225 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
