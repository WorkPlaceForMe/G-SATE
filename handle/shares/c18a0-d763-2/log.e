2021-08-12 02:06:39.879570: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcudart.so.10.1
/home/Quantela/ClothingAttributes/use/mysql.py:17: Warning: (1007, "Can't create database 'gsate'; database exists")
  self.cursor.execute('create database if not exists {}'.format(self.table.split('.')[0]))
/home/Quantela/ClothingAttributes/use/mysql.py:20: Warning: (1050, "Table 'clothing_gsate' already exists")
  self.cursor.execute('create table if not exists {} {}'.format(self.table, self.get_all(columns)))
 0 : compute_capability = 750, cudnn_half = 1, GPU: Tesla T4 
   layer   filters  size/strd(dil)      input                output
   0 conv     32       3 x 3/ 1    416 x 416 x   3 ->  416 x 416 x  32 0.299 BF
   1 conv     64       3 x 3/ 2    416 x 416 x  32 ->  208 x 208 x  64 1.595 BF
   2 conv     32       1 x 1/ 1    208 x 208 x  64 ->  208 x 208 x  32 0.177 BF
   3 conv     64       3 x 3/ 1    208 x 208 x  32 ->  208 x 208 x  64 1.595 BF
   4 Shortcut Layer: 1,  wt = 0, wn = 0, outputs: 208 x 208 x  64 0.003 BF
   5 conv    128       3 x 3/ 2    208 x 208 x  64 ->  104 x 104 x 128 1.595 BF
   6 conv     64       1 x 1/ 1    104 x 104 x 128 ->  104 x 104 x  64 0.177 BF
   7 conv    128       3 x 3/ 1    104 x 104 x  64 ->  104 x 104 x 128 1.595 BF
   8 Shortcut Layer: 5,  wt = 0, wn = 0, outputs: 104 x 104 x 128 0.001 BF
   9 conv     64       1 x 1/ 1    104 x 104 x 128 ->  104 x 104 x  64 0.177 BF
  10 conv    128       3 x 3/ 1    104 x 104 x  64 ->  104 x 104 x 128 1.595 BF
  11 Shortcut Layer: 8,  wt = 0, wn = 0, outputs: 104 x 104 x 128 0.001 BF
  12 conv    256       3 x 3/ 2    104 x 104 x 128 ->   52 x  52 x 256 1.595 BF
  13 conv    128       1 x 1/ 1     52 x  52 x 256 ->   52 x  52 x 128 0.177 BF
  14 conv    256       3 x 3/ 1     52 x  52 x 128 ->   52 x  52 x 256 1.595 BF
  15 Shortcut Layer: 12,  wt = 0, wn = 0, outputs:  52 x  52 x 256 0.001 BF
  16 conv    128       1 x 1/ 1     52 x  52 x 256 ->   52 x  52 x 128 0.177 BF
  17 conv    256       3 x 3/ 1     52 x  52 x 128 ->   52 x  52 x 256 1.595 BF
  18 Shortcut Layer: 15,  wt = 0, wn = 0, outputs:  52 x  52 x 256 0.001 BF
  19 conv    128       1 x 1/ 1     52 x  52 x 256 ->   52 x  52 x 128 0.177 BF
  20 conv    256       3 x 3/ 1     52 x  52 x 128 ->   52 x  52 x 256 1.595 BF
  21 Shortcut Layer: 18,  wt = 0, wn = 0, outputs:  52 x  52 x 256 0.001 BF
  22 conv    128       1 x 1/ 1     52 x  52 x 256 ->   52 x  52 x 128 0.177 BF
  23 conv    256       3 x 3/ 1     52 x  52 x 128 ->   52 x  52 x 256 1.595 BF
  24 Shortcut Layer: 21,  wt = 0, wn = 0, outputs:  52 x  52 x 256 0.001 BF
  25 conv    128       1 x 1/ 1     52 x  52 x 256 ->   52 x  52 x 128 0.177 BF
  26 conv    256       3 x 3/ 1     52 x  52 x 128 ->   52 x  52 x 256 1.595 BF
  27 Shortcut Layer: 24,  wt = 0, wn = 0, outputs:  52 x  52 x 256 0.001 BF
  28 conv    128       1 x 1/ 1     52 x  52 x 256 ->   52 x  52 x 128 0.177 BF
  29 conv    256       3 x 3/ 1     52 x  52 x 128 ->   52 x  52 x 256 1.595 BF
  30 Shortcut Layer: 27,  wt = 0, wn = 0, outputs:  52 x  52 x 256 0.001 BF
  31 conv    128       1 x 1/ 1     52 x  52 x 256 ->   52 x  52 x 128 0.177 BF
  32 conv    256       3 x 3/ 1     52 x  52 x 128 ->   52 x  52 x 256 1.595 BF
  33 Shortcut Layer: 30,  wt = 0, wn = 0, outputs:  52 x  52 x 256 0.001 BF
  34 conv    128       1 x 1/ 1     52 x  52 x 256 ->   52 x  52 x 128 0.177 BF
  35 conv    256       3 x 3/ 1     52 x  52 x 128 ->   52 x  52 x 256 1.595 BF
  36 Shortcut Layer: 33,  wt = 0, wn = 0, outputs:  52 x  52 x 256 0.001 BF
  37 conv    512       3 x 3/ 2     52 x  52 x 256 ->   26 x  26 x 512 1.595 BF
  38 conv    256       1 x 1/ 1     26 x  26 x 512 ->   26 x  26 x 256 0.177 BF
  39 conv    512       3 x 3/ 1     26 x  26 x 256 ->   26 x  26 x 512 1.595 BF
  40 Shortcut Layer: 37,  wt = 0, wn = 0, outputs:  26 x  26 x 512 0.000 BF
  41 conv    256       1 x 1/ 1     26 x  26 x 512 ->   26 x  26 x 256 0.177 BF
  42 conv    512       3 x 3/ 1     26 x  26 x 256 ->   26 x  26 x 512 1.595 BF
  43 Shortcut Layer: 40,  wt = 0, wn = 0, outputs:  26 x  26 x 512 0.000 BF
  44 conv    256       1 x 1/ 1     26 x  26 x 512 ->   26 x  26 x 256 0.177 BF
  45 conv    512       3 x 3/ 1     26 x  26 x 256 ->   26 x  26 x 512 1.595 BF
  46 Shortcut Layer: 43,  wt = 0, wn = 0, outputs:  26 x  26 x 512 0.000 BF
  47 conv    256       1 x 1/ 1     26 x  26 x 512 ->   26 x  26 x 256 0.177 BF
  48 conv    512       3 x 3/ 1     26 x  26 x 256 ->   26 x  26 x 512 1.595 BF
  49 Shortcut Layer: 46,  wt = 0, wn = 0, outputs:  26 x  26 x 512 0.000 BF
  50 conv    256       1 x 1/ 1     26 x  26 x 512 ->   26 x  26 x 256 0.177 BF
  51 conv    512       3 x 3/ 1     26 x  26 x 256 ->   26 x  26 x 512 1.595 BF
  52 Shortcut Layer: 49,  wt = 0, wn = 0, outputs:  26 x  26 x 512 0.000 BF
  53 conv    256       1 x 1/ 1     26 x  26 x 512 ->   26 x  26 x 256 0.177 BF
  54 conv    512       3 x 3/ 1     26 x  26 x 256 ->   26 x  26 x 512 1.595 BF
  55 Shortcut Layer: 52,  wt = 0, wn = 0, outputs:  26 x  26 x 512 0.000 BF
  56 conv    256       1 x 1/ 1     26 x  26 x 512 ->   26 x  26 x 256 0.177 BF
  57 conv    512       3 x 3/ 1     26 x  26 x 256 ->   26 x  26 x 512 1.595 BF
  58 Shortcut Layer: 55,  wt = 0, wn = 0, outputs:  26 x  26 x 512 0.000 BF
  59 conv    256       1 x 1/ 1     26 x  26 x 512 ->   26 x  26 x 256 0.177 BF
  60 conv    512       3 x 3/ 1     26 x  26 x 256 ->   26 x  26 x 512 1.595 BF
  61 Shortcut Layer: 58,  wt = 0, wn = 0, outputs:  26 x  26 x 512 0.000 BF
  62 conv   1024       3 x 3/ 2     26 x  26 x 512 ->   13 x  13 x1024 1.595 BF
  63 conv    512       1 x 1/ 1     13 x  13 x1024 ->   13 x  13 x 512 0.177 BF
  64 conv   1024       3 x 3/ 1     13 x  13 x 512 ->   13 x  13 x1024 1.595 BF
  65 Shortcut Layer: 62,  wt = 0, wn = 0, outputs:  13 x  13 x1024 0.000 BF
  66 conv    512       1 x 1/ 1     13 x  13 x1024 ->   13 x  13 x 512 0.177 BF
  67 conv   1024       3 x 3/ 1     13 x  13 x 512 ->   13 x  13 x1024 1.595 BF
  68 Shortcut Layer: 65,  wt = 0, wn = 0, outputs:  13 x  13 x1024 0.000 BF
  69 conv    512       1 x 1/ 1     13 x  13 x1024 ->   13 x  13 x 512 0.177 BF
  70 conv   1024       3 x 3/ 1     13 x  13 x 512 ->   13 x  13 x1024 1.595 BF
  71 Shortcut Layer: 68,  wt = 0, wn = 0, outputs:  13 x  13 x1024 0.000 BF
  72 conv    512       1 x 1/ 1     13 x  13 x1024 ->   13 x  13 x 512 0.177 BF
  73 conv   1024       3 x 3/ 1     13 x  13 x 512 ->   13 x  13 x1024 1.595 BF
  74 Shortcut Layer: 71,  wt = 0, wn = 0, outputs:  13 x  13 x1024 0.000 BF
  75 conv    512       1 x 1/ 1     13 x  13 x1024 ->   13 x  13 x 512 0.177 BF
  76 conv   1024       3 x 3/ 1     13 x  13 x 512 ->   13 x  13 x1024 1.595 BF
  77 conv    512       1 x 1/ 1     13 x  13 x1024 ->   13 x  13 x 512 0.177 BF
  78 conv   1024       3 x 3/ 1     13 x  13 x 512 ->   13 x  13 x1024 1.595 BF
  79 conv    512       1 x 1/ 1     13 x  13 x1024 ->   13 x  13 x 512 0.177 BF
  80 conv   1024       3 x 3/ 1     13 x  13 x 512 ->   13 x  13 x1024 1.595 BF
  81 conv    255       1 x 1/ 1     13 x  13 x1024 ->   13 x  13 x 255 0.088 BF
  82 yolo
[yolo] params: iou loss: mse (2), iou_norm: 0.75, cls_norm: 1.00, scale_x_y: 1.00
  83 route  79 		                           ->   13 x  13 x 512 
  84 conv    256       1 x 1/ 1     13 x  13 x 512 ->   13 x  13 x 256 0.044 BF
  85 upsample                 2x    13 x  13 x 256 ->   26 x  26 x 256
  86 route  85 61 	                           ->   26 x  26 x 768 
  87 conv    256       1 x 1/ 1     26 x  26 x 768 ->   26 x  26 x 256 0.266 BF
  88 conv    512       3 x 3/ 1     26 x  26 x 256 ->   26 x  26 x 512 1.595 BF
  89 conv    256       1 x 1/ 1     26 x  26 x 512 ->   26 x  26 x 256 0.177 BF
  90 conv    512       3 x 3/ 1     26 x  26 x 256 ->   26 x  26 x 512 1.595 BF
  91 conv    256       1 x 1/ 1     26 x  26 x 512 ->   26 x  26 x 256 0.177 BF
  92 conv    512       3 x 3/ 1     26 x  26 x 256 ->   26 x  26 x 512 1.595 BF
  93 conv    255       1 x 1/ 1     26 x  26 x 512 ->   26 x  26 x 255 0.177 BF
  94 yolo
[yolo] params: iou loss: mse (2), iou_norm: 0.75, cls_norm: 1.00, scale_x_y: 1.00
  95 route  91 		                           ->   26 x  26 x 256 
  96 conv    128       1 x 1/ 1     26 x  26 x 256 ->   26 x  26 x 128 0.044 BF
  97 upsample                 2x    26 x  26 x 128 ->   52 x  52 x 128
  98 route  97 36 	                           ->   52 x  52 x 384 
  99 conv    128       1 x 1/ 1     52 x  52 x 384 ->   52 x  52 x 128 0.266 BF
 100 conv    256       3 x 3/ 1     52 x  52 x 128 ->   52 x  52 x 256 1.595 BF
 101 conv    128       1 x 1/ 1     52 x  52 x 256 ->   52 x  52 x 128 0.177 BF
 102 conv    256       3 x 3/ 1     52 x  52 x 128 ->   52 x  52 x 256 1.595 BF
 103 conv    128       1 x 1/ 1     52 x  52 x 256 ->   52 x  52 x 128 0.177 BF
 104 conv    256       3 x 3/ 1     52 x  52 x 128 ->   52 x  52 x 256 1.595 BF
 105 conv    255       1 x 1/ 1     52 x  52 x 256 ->   52 x  52 x 255 0.353 BF
 106 yolo
[yolo] params: iou loss: mse (2), iou_norm: 0.75, cls_norm: 1.00, scale_x_y: 1.00
Total BFLOPS 65.879 
avg_outputs = 532444 
 Allocate additional workspace_size = 52.43 MB 
Loading weights from ./darknet/backup/yolov3.weights...Done! Loaded 107 layers from weights-file 
2021-08-12 02:07:03.355997: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcuda.so.1
2021-08-12 02:07:03.358677: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1716] Found device 0 with properties: 
pciBusID: 0001:00:00.0 name: Tesla T4 computeCapability: 7.5
coreClock: 1.59GHz coreCount: 40 deviceMemorySize: 15.75GiB deviceMemoryBandwidth: 298.08GiB/s
2021-08-12 02:07:03.358783: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcudart.so.10.1
2021-08-12 02:07:03.358880: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcublas.so.10
2021-08-12 02:07:03.358910: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcufft.so.10
2021-08-12 02:07:03.358939: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcurand.so.10
2021-08-12 02:07:03.791088: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcusolver.so.10
2021-08-12 02:07:03.825062: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcusparse.so.10
2021-08-12 02:07:03.825203: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcudnn.so.7
2021-08-12 02:07:03.839198: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1858] Adding visible gpu devices: 0
2021-08-12 02:07:03.938893: I tensorflow/core/platform/cpu_feature_guard.cc:142] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN)to use the following CPU instructions in performance-critical operations:  AVX2 FMA
To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags.
2021-08-12 02:07:04.006138: I tensorflow/core/platform/profile_utils/cpu_utils.cc:104] CPU Frequency: 2445415000 Hz
2021-08-12 02:07:04.006321: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x181d2ec0 initialized for platform Host (this does not guarantee that XLA will be used). Devices:
2021-08-12 02:07:04.006332: I tensorflow/compiler/xla/service/service.cc:176]   StreamExecutor device (0): Host, Default Version
2021-08-12 02:07:04.026268: I tensorflow/compiler/xla/service/service.cc:168] XLA service 0x181d2d10 initialized for platform CUDA (this does not guarantee that XLA will be used). Devices:
2021-08-12 02:07:04.026293: I tensorflow/compiler/xla/service/service.cc:176]   StreamExecutor device (0): Tesla T4, Compute Capability 7.5
2021-08-12 02:07:04.039280: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1716] Found device 0 with properties: 
pciBusID: 0001:00:00.0 name: Tesla T4 computeCapability: 7.5
coreClock: 1.59GHz coreCount: 40 deviceMemorySize: 15.75GiB deviceMemoryBandwidth: 298.08GiB/s
2021-08-12 02:07:04.039389: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcudart.so.10.1
2021-08-12 02:07:04.039409: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcublas.so.10
2021-08-12 02:07:04.039419: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcufft.so.10
2021-08-12 02:07:04.039432: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcurand.so.10
2021-08-12 02:07:04.039488: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcusolver.so.10
2021-08-12 02:07:04.039511: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcusparse.so.10
2021-08-12 02:07:04.039523: I tensorflow/stream_executor/platform/default/dso_loader.cc:48] Successfully opened dynamic library libcudnn.so.7
2021-08-12 02:07:04.048783: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1858] Adding visible gpu devices: 0
2021-08-12 02:07:04.048840: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1257] Device interconnect StreamExecutor with strength 1 edge matrix:
2021-08-12 02:07:04.048848: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1263]      0 
2021-08-12 02:07:04.048853: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1276] 0:   N 
2021-08-12 02:07:04.061100: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1402] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 4222 MB memory) -> physical GPU (device: 0, name: Tesla T4, pci bus id: 0001:00:00.0, compute capability: 7.5)
2021-08-12 02:07:15.398856: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 256.00M (268435456 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:15.443697: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 230.40M (241592064 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:15.447823: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 207.36M (217433088 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:15.450764: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 186.62M (195689984 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:15.453882: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 167.96M (176121088 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:38.401979: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:38.409649: W tensorflow/core/common_runtime/bfc_allocator.cc:246] Allocator (GPU_0_bfc) ran out of memory trying to allocate 546.16MiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were available.
2021-08-12 02:07:38.459645: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:38.459698: W tensorflow/core/common_runtime/bfc_allocator.cc:246] Allocator (GPU_0_bfc) ran out of memory trying to allocate 150.16MiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were available.
2021-08-12 02:07:38.501692: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:38.501722: W tensorflow/core/common_runtime/bfc_allocator.cc:246] Allocator (GPU_0_bfc) ran out of memory trying to allocate 150.20MiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were available.
2021-08-12 02:07:38.557226: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:38.557290: W tensorflow/core/common_runtime/bfc_allocator.cc:246] Allocator (GPU_0_bfc) ran out of memory trying to allocate 552.34MiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were available.
2021-08-12 02:07:38.681875: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:38.681912: W tensorflow/core/common_runtime/bfc_allocator.cc:246] Allocator (GPU_0_bfc) ran out of memory trying to allocate 153.62MiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were available.
2021-08-12 02:07:38.698491: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:38.698528: W tensorflow/core/common_runtime/bfc_allocator.cc:246] Allocator (GPU_0_bfc) ran out of memory trying to allocate 85.09MiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were available.
2021-08-12 02:07:38.730302: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:38.730351: W tensorflow/core/common_runtime/bfc_allocator.cc:246] Allocator (GPU_0_bfc) ran out of memory trying to allocate 561.31MiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were available.
2021-08-12 02:07:38.797437: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:38.797492: W tensorflow/core/common_runtime/bfc_allocator.cc:246] Allocator (GPU_0_bfc) ran out of memory trying to allocate 564.50MiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were available.
2021-08-12 02:07:38.923131: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:38.923188: W tensorflow/core/common_runtime/bfc_allocator.cc:246] Allocator (GPU_0_bfc) ran out of memory trying to allocate 162.81MiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were available.
2021-08-12 02:07:38.946638: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:38.946720: W tensorflow/core/common_runtime/bfc_allocator.cc:246] Allocator (GPU_0_bfc) ran out of memory trying to allocate 290.15MiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were available.
2021-08-12 02:07:38.971433: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:39.021361: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:39.097357: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 1.00G (1073741824 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:39.111051: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 2.00G (2147483648 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:39.142952: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 3.73G (4001847296 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:39.143714: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 3.73G (4001847296 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:39.165598: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 3.73G (4001847296 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:39.174546: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 3.73G (4001847296 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:39.229108: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 3.73G (4001847296 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:39.250592: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 3.73G (4001847296 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:39.251328: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 3.73G (4001847296 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
2021-08-12 02:07:39.295111: I tensorflow/stream_executor/cuda/cuda_driver.cc:775] failed to allocate 3.73G (4001847296 bytes) from device: CUDA_ERROR_OUT_OF_MEMORY: out of memory
