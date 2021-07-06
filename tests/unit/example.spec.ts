import { shallowMount } from '@vue/test-utils'
import TreePage from '@/components/package/TreePage'

describe('TreePage.vue', () => {
  it('renders props.msg when passed', () => {
    const title = 'new message'
    const wrapper = shallowMount(TreePage, {
      props: { title }
    })
    expect(wrapper.text()).toMatch(title)
  })
})
