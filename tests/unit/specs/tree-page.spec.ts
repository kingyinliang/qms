import { mount } from '@vue/test-utils'
import QueryTable from '@/components/package/QueryTable/src/index.vue'

describe('TreePage.vue', () => {
  const title = '标题啊'
  const wrapper = mount(QueryTable, {
    props: { title },
  })
  it('页面点击', async () => {
    await wrapper.setData({ menuVisible: true })
    expect(wrapper.vm.$data.menuVisible).toBe(true)
    await window.document.dispatchEvent(new Event('click'))
    console.log(wrapper.vm)
    // expect(wrapper.vm.$data.menuVisible).toBe(false)
  })
  it('title传值', () => {
    expect(wrapper.props().title).toMatch(title)
    // expect(wrapper.text()).toContain(title)
  })
})
