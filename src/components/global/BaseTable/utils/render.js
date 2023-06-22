export default {
  name: 'BaseRender',
  functional: true,
  props: {
    scope: {
      type: Object,
      default() {
        return {};
      },
    },
    render: {
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  render: (h, ctx) => (ctx.props.render ? ctx.props.render(h, ctx.props.scope) : ''),
};
