<template>
  <div v-loading="loading" class="mock-form">
    <el-form ref="mockForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="备注：">
        <el-input v-model.trim="form.remark" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label=" ">
        <el-checkbox v-model="form.isPriority" label="是否设置优先获取"></el-checkbox>
      </el-form-item>
      <el-form-item label="数据：" prop="jsonData">
        <el-input :autosize="{ minRows: 4, maxRows: 30}" type="textarea" v-model.trim="form.jsonData"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="info" size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { addMockData, editMockData } from '@/api/config/resc';

export default {
  props: {
    rescId: {
      type: String,
      required: true,
    },
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
        remark: '',
        isPriority: false,
        jsonData: '',
      },
      rules: {
        jsonData: [
          { required: true, message: '必填', trigger: 'blur' },
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
      this.$refs.mockForm.validate((valid) => {
        if (!valid) return;
        this.submit();
      });
    },
    async submit() {
      this.loading = true;
      const apiFn = this.editId ? editMockData : addMockData;
      const payload = {
        ...this.form,
        rescId: this.rescId,
      };
      if (this.editId) {
        payload._id = this.editId;
      }
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
.mock-form {
  .footer {
    text-align: right;
    padding-top: 24px;
  }
}
</style>
