<template>
  <div v-loading="loading" class="ip-form">
    <el-form ref="ipForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="姓名：" prop="username">
        <el-input placeholder="请输入" v-model.trim="form.username"></el-input>
      </el-form-item>
      <el-form-item label="IP：" prop="userIp">
        <el-input placeholder="请输入" v-model.trim="form.userIp"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="info" size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { addUserIp, editUserIp } from '@/api/config/ip';

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
        username: '',
        userIp: '',
      },
      rules: {
        username: [
          { required: true, message: '必填项', trigger: 'blur' },
        ],
        userIp: [
          { required: true, message: '必填项', trigger: 'blur' },
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
      this.$refs.ipForm.validate((valid) => {
        if (!valid) return;
        this.submit();
      });
    },
    async submit() {
      this.loading = true;
      const apiFn = this.editId ? editUserIp : addUserIp;
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
  },
};
</script>

<style lang="scss" scoped>
.ip-form {
  .footer {
    text-align: right;
    padding-top: 24px;
  }
}
</style>
