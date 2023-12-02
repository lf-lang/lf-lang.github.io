import clsx from 'clsx';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';

import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import { TeamRow } from './profiles';
import { active, past } from './people';

import { ReactNode } from 'react';
import Link from '@docusaurus/Link';

const zulipLogo = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icHJlZml4X19hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMjRBREZGIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjN0I3MUZGIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZmlsbD0idXJsKCNwcmVmaXhfX2EpIiBkPSJNMTI4IDBjNzAuNjkyIDAgMTI4IDU3LjMwOCAxMjggMTI4IDAgNzAuNjkyLTU3LjMwOCAxMjgtMTI4IDEyOEM1Ny4zMDggMjU2IDAgMTk4LjY5MiAwIDEyOCAwIDU3LjMwOCA1Ny4zMDggMCAxMjggMFptLTYuMzIgMTE4LjIyMi00NS44OTIgNDAuOTc5Yy00LjcyOCAzLjcyLTcuODMgOS44Ni03LjgzIDE2Ljc2NiAwIDExLjI3OSA4LjI3NCAyMC41MDggMTguMzg2IDIwLjUwOGg4Ni4yNDdjMTAuMTEyIDAgMTguMzg2LTkuMjMgMTguMzg2LTIwLjUwOCAwLTExLjI4LTguMjc0LTIwLjUwNy0xOC4zODYtMjAuNTA3SDEwNy4zYy0uOTY4IDAtMS41OC0xLjE2LTEuMTA4LTIuMTA0bDE2LjgzMy0zMy43MDNjLjYxNS0uOTgzLS40OTMtMi4xNjEtMS4zNDUtMS40M1ptNTAuOTEtNTguODZIODYuMzQ1Yy0xMC4xMTIgMC0xOC4zODYgOS4yMjctMTguMzg2IDIwLjUwOCAwIDExLjI3OSA4LjI3NCAyMC41MDggMTguMzg2IDIwLjUwOGg2NS4yOTJjLjk2OCAwIDEuNTggMS4xNiAxLjEwOCAyLjEwM2wtMTYuODM0IDMzLjcwNGMtLjYxNS45ODMuNDk0IDIuMTYxIDEuMzQ2IDEuNDNsNDUuODkyLTQwLjk4NGM0LjcyNy0zLjcyMyA3LjgyOS05Ljg2IDcuODI5LTE2Ljc2NyAwLTExLjI3OC04LjI3NC0yMC41MDctMTguMzg2LTIwLjUwMVoiLz48L3N2Zz4=";
const XLogo = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTU2IDE3LjRjLTEuOC44LTMuNyAxLjMtNS43IDEuNSAyLTEuMiAzLjYtMy4xIDQuMy01LjMtMS45IDEuMS00IDEuOS02LjMgMi4zLTEuOC0xLjktNC40LTMuMS03LjItMy4xLTUuNCAwLTkuOCA0LjMtOS44IDkuNyAwIC44LjEgMS41LjMgMi4yLTguMi0uNC0xNS40LTQuMy0yMC4zLTEwLjEtLjggMS40LTEuMyAzLjEtMS4zIDQuOSAwIDMuNCAxLjcgNi4zIDQuNCA4LTEuNi0uMS0zLjEtLjUtNC41LTEuMnYuMWMwIDQuNyAzLjQgOC42IDcuOSA5LjUtLjguMi0xLjcuMy0yLjYuMy0uNiAwLTEuMy0uMS0xLjktLjIgMS4zIDMuOCA0LjkgNi42IDkuMiA2LjctMy40IDIuNi03LjYgNC4xLTEyLjIgNC4xLS44IDAtMS42IDAtMi4zLS4xIDQuNCAyLjcgOS41IDQuMyAxNS4xIDQuMyAxOC4xIDAgMjgtMTQuNyAyOC0yNy41di0xLjNjMS45LTEuMiAzLjYtMi45IDQuOS00Ljh6Ii8+PC9zdmc+";
const githubLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzlFQkFERkU4NkJCMTFFM0FBNTJFRTMzNTJEMUJDNDYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzlFQkFERkQ4NkJCMTFFM0FBNTJFRTMzNTJEMUJDNDYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU1MTc4QTJFOTlBMDExRTI5QTE1QkMxMDQ2QTg5MDREIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU1MTc4QTJGOTlBMDExRTI5QTE1QkMxMDQ2QTg5MDREIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Kk5lQwAABYxJREFUeNrkm29oVXUYx3+7bM3V1FnbqlltrtXWtYRa1nqxooY5E7EhKWGuaTDBagol9SIMDCKICASj+cISw/DPi16ZBakrUBnoC7nNoTMWy6I1c+LmVq6t78N9jpyu555znt855+536IHPi939/jzP95zznN+/kzc1NaUitirwJJgPasF94DZQDG7hMqNgBFwEZ5kU+AH0R+lcXgQCJMBT4EXwLKgM2N7P4FvwJegCk6YKUA5eB23grogu2C/gc7AN/GGKABTsZtAOZqjc2DjYAT5kUfSNBNCkAGwGo1PTZ6PsQ4FuHLp3QD3YDR5QZtgZsAac1ElYokcGbATHDApesS/kUwf7GEkOKAK7wAvKbNsPXgZjYQowG3wNnlDxsONgCbgchgAU/GHwiIqXUT5o8hLBKwfcDA7FMHgrUR/iGLQEoGTyBWhQ8bUGjiFPR4A3QIuKv7VwLKIcQMnue5Dv0fjT/IwtAM3g+RyMBmkU+BXf3qc5Rx3xqDPBE7LjfkaCheCcj1HYKYe6JeBt8GcEo75L3HaJQ7+nfNQ/x7H9p67TFX4L1Pi4EocdfhsGH4BPwVbwqu0xGwI/8vT2N/77Gv+vAJSCO3n6PJ//Vjz72w62cPtORnfAwx7+1nBsW93ugGow7vOKtPkYa9eDl0Clxji9kuvW+yjb5tPncY7xet3MhjoFt2RzgIlU2DQL/O6017W/Be4BawXJqMCgTH+ToOxajvWG1+AmYVBlBglQKrxwmzIFoB9XCzt91CABpL6sti62JcBiXtKS2GMGCSD1pZxjvi7AKmED9PraYJAAG2yvVL+2yi7AImHl90C3QQJ03/B+97ZF1lCYVlN6BBV/BffykNQkoyF4H5grqJOkO6BR2NF2A4O35gifCOs0JjTW9vYaPPPbJ11LJAFqBRVoDf68wQLQI3BBUL424XPiY1lvDOb/ZwRla0iAOYIKv8dAgEFB2VtJgJmCChMxEEAyHigmAQoFFWbFQIDZgrKF0p2hmTEQQOQjCTAmKD8vBgJUCcqOkQBXBBXosEORwcEXKdmBjCskwICgQr5h0+BMW6i8V7LtNkAC9As7WWqwAM8Jy/cnhBMhspVKvq2eC0uwbxLrSWhMa+dpdJQLW6mRpLtpOlyuMcL7CTwErhoSPG2ApjQEuD3BQ0fp0ZJqlT6pZYpt0wieYh60nuWDGp2+At4xIPgt7IvU0jHzBkFdgD27HWDGNGyGFHHfulaXuTN0IkBjZ8EykJeDwKmPFtAXwN8TTltjrVkKfwcawXJW3G3v8DTYCKoiCLwGvAl6QthpbnU6J5jP2f1uh1Wgxbbxwv0qvT/vtZRGA6wuzs50+Pkb8JdgQtPMq1VJld7bnxtSzhjgJD5hzwEW611OZK6xlSvzeYbAsl3Cx4PK7ozodOl6t93hfJByqbzOVnYh+MdHhxfBLI1bnuoMhRx8imPMKgDR5LG/nrSVfddHpx8HeO4/ClmApsw+snXsdk7gYMat+r5Hp0sDCLAkxOA7nfrI1nGxx2tmQUb5x8FuzgvD4Dw4wNm2MIAA1SEF38cx+RaAeBCMZGlwb44GOyUhBD/CsTj24TatpddXq3L+RIVmXnE4QzjJMaSylvBxFdqzKHsVrDD8Dmj36sOvIx0unewHDRENg4MI0BH2FyP0RcZOlzW3Ib7VLvPqDK0z1PEq7bDmLVwCLgnr0AhvnUp/0eJp0k9m6HO4fUp2nGZODgUY5PzUJVlHkxg1TEfnjxqY8I6yb12SSjqLm7T9/Ax4TaW/+JxuIx862KcL4toBk1QFT1omXZLRHQHaL3Npl/r8jH3QjiGsbJ3kGd/fDo6WBWi31KG9a9xXMgzfw35tVfCR9l52dk8Ibe7htnq57YowfY7i4+lYWUL9z+1fAQYACqstE4NCc18AAAAASUVORK5CYII=";

export const SocialMediaCard = ({imageSrc, name, children}: {
  imageSrc: string,
  name: string,
  children: ReactNode
}) => {
  return (
    <div className='col col--4 margin-bottom--lg'>
      <div className="card card--full-height">
        <div className="card__header">
          <div className="avatar avatar--vertical">
            <img
              className="avatar__photo avatar__photo--xl"
              src={imageSrc}
              alt={name}
            />
            <div className="avatar__intro">
              <Heading as="h4" className="avatar__name">
                {name}
              </Heading>
            </div>
          </div>
        </div>
        <div className="card__body">{children}</div>
      </div>
    </div>
  );  
}

export default function Community(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout>
      {/* Social media */}
      {/* Active contributors */}
      <div className="section">
        <div className="container">
          <Heading
            as="h2"
            className={clsx('margin-bottom--lg', 'text--center')}
          >
            <Translate>Online</Translate>
          </Heading>
          <div className={'text--center'}>
            Tap into our online resources to learn more about Lingua Franca, provide feedback, connect with our developers, and find out about new updates.
          </div>
          <div className={clsx('row')}>
            <SocialMediaCard imageSrc={zulipLogo} name="Zulip" >
              <>
                Have questions, or want to chat with other users? <Link href="https://lf-lang.zulipchat.com/">Join the conversation on Zulip.</Link>
              </>
            </SocialMediaCard>
            <SocialMediaCard imageSrc={githubLogo} name="GitHub" >
              <>
                Found a bug, or want to provide feedback? <Link href="https://github.com/lf-lang/lingua-franca/issues/new/choose">Tell us on GitHub.</Link>
              </>
            </SocialMediaCard>
            <SocialMediaCard imageSrc={XLogo} name="X/Twitter" >
              <>
                Stay up to date. Follow us on Twitter <Link href="https://twitter.com/thelflang" title="Lingua Franca on Twitter" target="_blank">@thelflang</Link>!
              </>
            </SocialMediaCard>
          </div>
        </div>
      </div>

      {/* Active contributors */}
      <div className="section sectionAlt">
        <div className="container">
          <Heading
            as="h2"
            className={clsx('margin-bottom--lg', 'text--center')}
          >
            <Translate>Active Contributors</Translate>
          </Heading>
            <TeamRow people={active} />
        </div>
      </div>

      {/* Past contributors */}
      <div className="section">
        <div className="container">
          <Heading
            as="h2"
            className={clsx('margin-bottom--lg', 'text--center')}
          >
            <Translate>Past Contributors</Translate>
          </Heading>
            <TeamRow people={past} />
        </div>
      </div>
    </Layout>
  );
}
