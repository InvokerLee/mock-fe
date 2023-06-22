<template>
  <div v-loading="loading" class="sys-form">
    <el-form ref="sysForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="域名：" prop="host">
        <el-input placeholder="host" v-model="form.host">
        </el-input>
      </el-form-item>
      <el-row type="flex">
        <el-col class="scheme-field">
          <el-form-item label-width="0px">
            <el-select placeholder="请选择" v-model="form.scheme">
              <el-option label="http://" value="http"></el-option>
              <el-option label="https://" value="https"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop="ip" label-width="0px">
            <el-autocomplete
              style="width: 100%;"
              v-model.trim="form.ip"
              :fetch-suggestions="fetchFn"
              placeholder="ip 或者 姓名"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col class="port-field">
          <el-input v-only-num v-model="form.port" placeholder="端口"></el-input>
        </el-col>
      </el-row>
      <el-form-item label="系统名称：" prop="systemName">
        <el-input v-model.trim="form.systemName"></el-input>
      </el-form-item>
      <el-form-item label="swagger-api：">
        <el-input v-model.trim="form.swaggerApi"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="info" size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { addSystem, editSystem } from '@/api/config/system';
import { getIpsByUser } from '@/api/config/ip';

export default {
  props: {
    row: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false,
      form: {
        systemName: '',
        scheme: 'http',
        host: '',
        port: '',
        ip: '',
        swaggerApi: '/v2/api-docs',
      },
      rules: {
        systemName: [
          { required: true, message: '必填项', trigger: 'blur' },
        ],
        host: [
          { required: true, message: '必填项', trigger: 'blur' },
        ],
        ip: [
          { required: true, message: '必填项', trigger: 'change' },
          { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: '格式错误', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    editId() {
      return this.row._id;
    },
  },
  created() {
    if (!this.editId) return;
    Object.keys(this.form).forEach((key) => {
      this.form[key] = this.row[key];
    });
  },
  methods: {
    confirm() {
      this.$refs.sysForm.validate((valid) => {
        if (!valid) return;
        this.submit();
      });
    },
    async submit() {
      this.loading = true;
      const apiFn = this.editId ? editSystem : addSystem;
      const payload = this.editId ? { ...this.form, _id: this.editId } : this.form;
      const [err] = await apiFn(payload);
      this.loading = false;
      if (err) return;
      this.$message.success('保存成功');
      this.$emit('success');
      this.cancel();
    },
    cancel() {
      this.$emit('close');
    },
    async fetchFn(queryStr, cb) {
      if (!queryStr) return cb([]);
      const [, res] = await getIpsByUser({ username: queryStr });
      if (res) {
        cb(res.map((v) => {
          return {
            value: `${v.username} (${v.userIp})`,
            ip: v.userIp,
          };
        }));
      }
    },
    handleSelect(item) {
      this.form.ip = item.ip;
    },
  },
};
</script>

<style lang="scss" scoped>
.sys-form {
  .footer {
    text-align: right;
    padding-top: 24px;
  }
  .scheme-field {
    width: 120px;
    flex-shrink: 0;
  }
  .port-field {
    width: 80px;
    flex-shrink: 0;
  }
  ::v-deep .el-input-group__append {
    padding: 0;
    border: none;
  }
}
</style>
