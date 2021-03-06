import React, {Component} from 'react';
import {Modal, Button, Row, Col, Form, Input, Radio, Select, Mention, Icon, TimePicker} from 'antd';
import './mdcConfigStyle/configModal.less'
import {getNewList} from 'api/mdcConfig.js'

const Option = Select.Option;
const FormItem = Form.Item;
const {toString} = Mention;

function onChange(editorState) {
  console.log(toString(editorState));
}


const configModal = Form.create()(
  class extends React.Component {
    state = {
      visible: false,
      confirmLoading: false,
      number: 0,
      currency: 'rmb',
      cfsInput: '',
      cfsList: [],
      timeRange: [null, null]
    }
    componentDidMount() {
      getNewList().then((e) => {
        console.log(e,'getNewListgetNewListgetNewListgetNewList');
      }).catch((e) => {
        console.log(e,"失败啦失败啦");
      })
    }

    handleCurrencyChange = (currency) => {
      if (!('value' in this.props)) {
        this.setState({currency});
      }
      this.triggerChange({currency});
    }

    triggerChange = (changedValue) => {
      // Should provide an event to pass value to Form.
      const onChange = this.props.onChange;
      if (onChange) {
        onChange(Object.assign({}, this.state, changedValue));
      }
    }

    handleOk = () => {
      this.setState({
        confirmLoading: true,
      });
      setTimeout(() => {
        this.setState({
          visible: false,
          confirmLoading: false,
        });
        this.props.onClose(false)
      }, 2000);
    }

    handleCancel = () => {
      console.log('Clicked cancel button');
      this.setState({
        visible: false,
      });
      this.props.onClose(false)
    }

    cfsInputChange = (e) => {
      this.setState({
        /*方法一：推荐使用*/
        cfsInput: this.refs.myInput.input.value
      });
    }
    cfsListAdd = (e) => {
      if (this.state.cfsInput.trim()) {
        let _temp = this.state.cfsList.concat([])
        _temp.push(this.state.cfsInput)
        this.setState({
          /*方法一：推荐使用*/
          cfsList: _temp
        });
      }
    }
    cfsListDelete = (index) => {
      let _temp = this.state.cfsList.concat([])
      _temp.splice(index, 1)
      this.setState({
        /*方法一：推荐使用*/
        cfsList: _temp
      });
    }

    timeStartChange = (time) => {
      let _temp = this.state.timeRange.concat([])
      _temp[0] = time
      this.setState({timeRange: _temp});
    }
    timeEndChange = (time) => {
      let _temp = this.state.timeRange.concat([])
      _temp[1] = time
      this.setState({timeRange: _temp});
    }

    // timeRangeChange =()=>{}

    render() {
      const {form} = this.props;
      const {getFieldDecorator} = form;
      const formItemLayout = {
        labelCol: {
          xs: {span: 24},
          sm: {span: 4},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 20},
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
      const cfsListItems = this.state.cfsList.map((item, index) => {
        return <li key={index}>{item}<Icon className="closeIcon"
                                           onClick={this.cfsListDelete.bind(this, index)}
                                           type="close"/></li>
      })
      return (
        <div className="configModal">
          <Modal title="配置"
                 width="900px"
                 wrapClassName={'configModalContent'}
                 maskClosable={false}
                 cancelText={'取消'}
                 okText={'确定'}
                 visible={this.props.show}
                 onOk={this.handleOk}
                 confirmLoading={this.state.confirmLoading}
                 onCancel={this.handleCancel}
          >
            <Form>
              <FormItem
                {...formItemLayout}
                label="请选择MDC：">
                {(
                  <Select
                    value={this.state.currency}
                    size={this.state.size}
                    style={{width: 300}}
                    onChange={this.handleCurrencyChange}
                  >
                    <Option value="rmb">RMB</Option>
                    <Option value="dollar">Dollar</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="上游cfs服务：">
                <Input ref="myInput"
                       onChange={this.cfsInputChange.bind(this)}
                       style={{width: 300}}></Input><Icon className="plusIcon"
                                                          onClick={this.cfsListAdd}
                                                          type="plus-circle-o"/>
                <br/>
                <div className="cfsList">
                  <ul>{cfsListItems}</ul>
                </div>
              </FormItem>
              <Row>
                <Col span={14}>
                  <FormItem labelCol={{xs: {span: 7}}}
                            wrapperCol={{xs: {span: 17}}}
                            label="工作时间段：">
                    {(<div>
                        <TimePicker
                          style={{width: 140}}
                          placeholder={'start'}
                          value={this.state.timeRange[0]}
                          onChange={this.timeStartChange}
                        />
                        <span style={{color: 'rgba(0,0,0,.25)', margin: '0 10px'}}>至</span>
                        <TimePicker
                          style={{width: 140}}
                          placeholder={'end'}
                          value={this.state.timeRange[1]}
                          onChange={this.timeEndChange}
                        />
                      </div>
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem labelCol={{xs: {span: 12}}}
                            wrapperCol={{xs: {span: 12}}}
                            label="指定工作时间段给MDC：">
                    {(<Select
                        value={this.state.currency}
                        size={this.state.size}
                        style={{width: 120}}
                        onChange={this.handleCurrencyChange}
                      >
                        <Option value="rmb">RMB</Option>
                        <Option value="dollar">Dollar</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
      );
    }
  }
)

export default configModal;