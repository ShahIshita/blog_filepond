<template>
  <div>
    <h1>File Uploader</h1>
    <div ref="filepond"></div>
  </div>

  <!-- <FilePond
      ref="pond"
      name="file"
      allowMultiple
      acceptedFileTypes="image/*"
      maxFileSize="5MB"
      v-model="files"
      @update:files="handleFile"
    />
    <div v-if="files.length">
      <h2>Uploaded Files:</h2>
      <ul>
        <li v-for="file in files" :key="file.serverId">
          {{ file.file.name }} ({{ formatBytes(file.fileSize) }})
        </li>
      </ul>
    </div> -->
</template>

<script>
import * as FilePond from "filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

// Register FilePond plugins
FilePond.registerPlugin(FilePondPluginFileValidateSize);
FilePond.registerPlugin(FilePondPluginFileValidateType);

export default {
  data() {
    return {
      serverConfig: {
        process: this.uploadFile,
        revert: null, // Optional: If you want to handle file revert
      },
    };
  },
  methods: {
    async uploadFile(fieldName, file, metadata, load, error, progress) {
      const chunkSize = 1024 * 1024; // 1 MB chunk size (adjust as needed)
      const totalChunks = Math.ceil(file.size / chunkSize);
      let chunkIndex = 0;

      const uploadChunk = async () => {
        const startByte = chunkIndex * chunkSize;
        const endByte = Math.min(startByte + chunkSize, file.size);
        const chunk = file.slice(startByte, endByte);

        const formData = new FormData();
        formData.append("file", chunk);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/uploads", true);

        xhr.upload.onprogress = (event) => {
          const progressPercent =
            ((chunkIndex * chunkSize + event.loaded) / file.size) * 100;
          progress(progressPercent, chunkIndex * chunkSize + event.loaded, file.size);
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            chunkIndex++;
            if (chunkIndex < totalChunks) {
              uploadChunk();
            } else {
              load(xhr.responseText);
            }
          } else {
            error("Upload failed");
          }
        };

        xhr.onerror = () => {
          error("Upload failed");
        };

        xhr.send(formData);
      };

      uploadChunk();
    },
  },
  mounted() {
    FilePond.create(this.$refs.filepond, {
      allowMultiple: true,
      server: this.serverConfig,
    });
  },
};
</script>
