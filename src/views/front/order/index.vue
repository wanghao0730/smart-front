<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="收货人" prop="receiveName">
        <el-input
          v-model="queryParams.receiveName"
          placeholder="请输入收货人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单编号id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机" prop="receivePhone">
        <el-input
          v-model="queryParams.receivePhone"
          placeholder="请输入收货人手机"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="支付方式" prop="payMode">
        <el-input
          v-model="queryParams.payMode"
          placeholder="请选择支付方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->

      <el-form-item label="完成时间" prop="finishedTime">
        <el-date-picker
          clearable
          v-model="queryParams.finishedTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择完成时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="预约时间" prop="appointmentTime">
        <el-date-picker
          clearable
          v-model="queryParams.appointmentTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择预约时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStep">
        <el-input
          v-model="queryParams.orderStep"
          placeholder="请输入订单状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="取消原因" prop="cancelRemark">
        <el-input
          v-model="queryParams.cancelRemark"
          placeholder="请输入取消原因"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="取消时间" prop="cancelTime">
        <el-date-picker
          clearable
          v-model="queryParams.cancelTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择取消时间"
        >
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['front:order:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['front:order:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['front:order:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['front:order:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- 表格位置 -->
    <el-table
      v-loading="loading"
      :data="orderList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键" align="center" prop="id" /> -->
      <el-table-column label="订单类型" align="center" prop="type">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.type === 1">帮我送</el-tag>
          <el-tag type="warning" v-if="scope.row.type === 2">帮我买</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="订单编号" align="center" prop="orderId" />
      <el-table-column label="收货人" align="center" prop="receiveName" />
      <el-table-column label="手机" align="center" prop="receivePhone" />
      <el-table-column label="收货地区" align="center" prop="receiveProvince" />
      <el-table-column label="详细地址" align="center" prop="receiveAddress" />
      <el-table-column label="取货详情" align="center" prop="deliveryAddress" />
      <el-table-column label="订单费用" align="center" prop="orderAmount" />
      <el-table-column label="跑腿小费" align="center" prop="tipFee" />
      <!-- <el-table-column label="支付方式" align="center" prop="payMode" /> -->
      <el-table-column label="货物内容" align="center" prop="orderDetailName" />
      <el-table-column label="备注信息" align="center" prop="orderRemark" />
      <!-- <el-table-column label="完成时间" align="center" prop="finishedTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.finishedTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="预约时间" align="center" prop="appointmentTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.appointmentTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货物信息" align="center" prop="orderDetailCode" />
      <el-table-column label="订单状态" align="center" prop="orderStep">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.orderStep === 0">已取消</el-tag>
          <el-tag v-if="scope.row.orderStep === 1">待接单</el-tag>
          <el-tag type="warning" v-if="scope.row.orderStep === 2"
            >待派送</el-tag
          >
          <el-tag type="success" v-if="scope.row.orderStep === 3"
            >已取货</el-tag
          >
          <el-tag type="danger" v-if="scope.row.orderStep === 4">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['front:order:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['front:order:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改订单管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="发起订单用户" disabled />
        </el-form-item>
        <el-form-item label="订单id" prop="orderId">
          <el-input
            v-model="form.orderId"
            placeholder="请输入订单id"
            disabled
          />
        </el-form-item>
        <el-form-item label="收货人昵称" prop="receiveName">
          <el-input v-model="form.receiveName" placeholder="请输入收货人昵称" />
        </el-form-item>
        <el-form-item label="收货人手机" prop="receivePhone">
          <el-input
            v-model="form.receivePhone"
            placeholder="请输入收货人手机"
          />
        </el-form-item>
        <el-form-item label="收货地区" prop="receiveProvince">
          <el-input
            v-model="form.receiveProvince"
            placeholder="请输入收货地区"
          />
        </el-form-item>
        <el-form-item label="收货详情地址" prop="receiveAddress">
          <el-input
            v-model="form.receiveAddress"
            placeholder="请输入收货详情地址"
          />
        </el-form-item>
        <el-form-item label="取货地址详情" prop="deliveryAddress">
          <el-input
            v-model="form.deliveryAddress"
            placeholder="请输入取货地址详情"
          />
        </el-form-item>
        <el-form-item label="代买订单费用" prop="orderAmount">
          <el-input
            v-model="form.orderAmount"
            placeholder="请输入代买订单费用"
          />
        </el-form-item>
        <el-form-item label="跑腿小费" prop="tipFee">
          <el-input v-model="form.tipFee" placeholder="请输入跑腿小费" />
        </el-form-item>
        <!-- <el-form-item label="1线下支付 2线上支付" prop="payMode">
          <el-input
            v-model="form.payMode"
            placeholder="请输入1线下支付 2线上支付"
          />
        </el-form-item> -->
        <el-form-item label="货物内容" prop="orderDetailName">
          <el-input
            v-model="form.orderDetailName"
            placeholder="请输入货物内容"
          />
        </el-form-item>
        <el-form-item label="订单备注信息" prop="orderRemark">
          <el-input
            v-model="form.orderRemark"
            placeholder="请输入订单备注信息"
          />
        </el-form-item>
        <el-form-item label="完成时间" prop="finishedTime">
          <el-date-picker
            clearable
            v-model="form.finishedTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择完成时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预约时间" prop="appointmentTime">
          <el-date-picker
            clearable
            v-model="form.appointmentTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择预约时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="货物信息" prop="orderDetailCode">
          <el-input
            v-model="form.orderDetailCode"
            placeholder="请输入货物信息"
          />
        </el-form-item>
        <!-- <el-form-item label="订单状态" prop="orderStep">
          <el-input v-model="form.orderStep" placeholder="请输入订单状态" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listOrder,
  getOrder,
  delOrder,
  addOrder,
  updateOrder,
} from "@/api/front/order";

export default {
  name: "Order",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 订单管理表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        userId: null,
        orderId: null,
        receiveName: null,
        receivePhone: null,
        receiveProvince: null,
        receiveAddress: null,
        deliveryAddress: null,
        orderAmount: null,
        tipFee: null,
        payMode: null,
        orderDetailName: null,
        orderRemark: null,
        finishedTime: null,
        appointmentTime: null,
        orderDetailCode: null,
        orderStep: null,
        cancelRemark: null,
        cancelTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          { required: true, message: "订单类型不能为空", trigger: "change" },
        ],
        userId: [
          {
            required: true,
            message: "用户openid(发起订单用户)不能为空",
            trigger: "blur",
          },
        ],
        orderId: [
          { required: true, message: "订单id不能为空", trigger: "blur" },
        ],
        receiveName: [
          { required: true, message: "收货人昵称不能为空", trigger: "blur" },
        ],
        receivePhone: [
          { required: true, message: "收货人手机不能为空", trigger: "blur" },
        ],
        receiveProvince: [
          { required: true, message: "收货地区不能为空", trigger: "blur" },
        ],
        receiveAddress: [
          { required: true, message: "收货详情地址不能为空", trigger: "blur" },
        ],
        deliveryAddress: [
          { required: true, message: "取货地址详情不能为空", trigger: "blur" },
        ],
        tipFee: [
          { required: true, message: "跑腿小费不能为空", trigger: "blur" },
        ],
        payMode: [
          {
            required: true,
            message: "1线下支付 2线上支付不能为空",
            trigger: "blur",
          },
        ],
        orderDetailName: [
          { required: true, message: "货物内容不能为空", trigger: "blur" },
        ],
        appointmentTime: [
          { required: true, message: "预约时间不能为空", trigger: "blur" },
        ],
        orderDetailCode: [
          { required: true, message: "货物信息不能为空", trigger: "blur" },
        ],
        orderStep: [
          { required: true, message: "订单状态不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询订单管理列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then((response) => {
        this.orderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        type: null,
        userId: null,
        orderId: null,
        receiveName: null,
        receivePhone: null,
        receiveProvince: null,
        receiveAddress: null,
        deliveryAddress: null,
        orderAmount: null,
        tipFee: null,
        payMode: null,
        orderDetailName: null,
        orderRemark: null,
        finishedTime: null,
        appointmentTime: null,
        orderDetailCode: null,
        orderStep: null,
        cancelRemark: null,
        cancelTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加订单管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.orderId || this.ids; //拿orderid查询
      getOrder(id).then((response) => {
        console.log("zg", response);
        this.form = response.data;
        this.open = true;
        this.title = "修改订单管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateOrder(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除订单管理编号为"' + ids + '"的数据项？')
        .then(function () {
          return delOrder(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "front/order/export",
        {
          ...this.queryParams,
        },
        `order_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
