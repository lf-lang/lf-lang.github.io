// Why use translate here? Since we use docusaurus's Translate feature, which is simpler then react-i18n, we abide by its rules which requires us to apply it to static assets.
// See the warnings here: https://docusaurus.io/docs/i18n/tutorial#translate-your-react-code
import Translate, { translate } from "@docusaurus/Translate";

export const active = [
  {
    name: "Peter Donovan",
    avatar: "https://avatars.githubusercontent.com/u/33707478?v=4",
    blurb: <Translate>Student Assistant at UC Berkeley.</Translate>,
  },
  {
    name: "Clément Fournier",
    avatar: "https://avatars.githubusercontent.com/u/24524930?v=4",
    blurb: <Translate>PhD student at TU Dresden.</Translate>,
  },
  {
    name: "Erling Rennemo Jellum",
    personalSiteUrl: "https://erlingrj.github.io",
    avatar:
      "https://backends.it.ntnu.no/user-profile-service/rest/files/139f11cf-c2bb-365e-bbbb-559165b9cb31",
    blurb: (
      <Translate>
        PhD Candidate at Norwegian University of Science and Technology.
      </Translate>
    ),
  },
  {
    name: "Byeonggil Jun",
    avatar: "https://avatars.githubusercontent.com/u/78055940?s=400&v=4",
    blurb: <Translate>Undergraduate student at Hanyang University.</Translate>,
  },
  {
    name: "Dongha Kim",
    avatar: "https://avatars.githubusercontent.com/u/74869052?s=400&v=4",
    blurb: <Translate>Ph.D. student at Arizona State University.</Translate>,
  },
  {
    name: "Hokeun Kim",
    personalSiteUrl: "https://hokeun.github.io/",
    avatar: "https://avatars.githubusercontent.com/u/2585943?v=4",
    blurb: (
      <Translate>Assistant Professor at Arizona State University.</Translate>
    ),
  },
  {
    name: "Edward A. Lee",
    personalSiteUrl: "http://people.eecs.berkeley.edu/~eal/",
    avatar: "https://avatars.githubusercontent.com/u/8513334?v=4",
    blurb: (
      <Translate>Professor in the Graduate School at UC Berkeley.</Translate>
    ),
  },
  {
    name: "Shaokai Lin",
    personalSiteUrl: "https://shaokai.io",
    avatar: "https://avatars.githubusercontent.com/u/7968955?v=4",
    blurb: <Translate>Graduate Student at UC Berkeley.</Translate>,
  },
  {
    name: "Marten Lohstroh",
    personalSiteUrl: "http://people.eecs.berkeley.edu/~marten/",
    avatar: "https://avatars.githubusercontent.com/u/19938940?v=4",
    blurb: <Translate>Assistant Researcher at UC Berkeley.</Translate>,
  },
  {
    name: "Johannes Hayeß",
    avatar: "https://avatars.githubusercontent.com/u/7195008?v=4",
    blurb: <Translate>Master's Student at TU Dresden.</Translate>,
  },
  {
    name: "Christian Menard",
    personalSiteUrl:
      "https://cfaed.tu-dresden.de/investigators-institutions/compiler-construction/ccc-staff/christian-menard",
    avatar: "https://avatars.githubusercontent.com/u/6460123?v=4",
    blurb: <Translate>Graduate Student at TU Dresden.</Translate>,
  },
  {
    name: "Alexander Schulz-Rosengarten",
    avatar: "https://avatars.githubusercontent.com/u/25612037?v=4",
    blurb: <Translate>Postdoc at Kiel University.</Translate>,
  },
  {
    name: "axmmisaka",
    avatar:
      "https://github.com/axmmisaka/axmmisaka/blob/master/TV%E3%82%A2%E3%83%8B%E3%83%A1%E3%80%8C%E3%81%BC%E3%81%A3%E3%81%A1%E3%83%BB%E3%81%96%E3%83%BB%E3%82%8D%E3%81%A3%E3%81%8F%EF%BC%81%E3%80%8D%E7%AC%AC11%E8%A9%B1%E3%80%8C%E5%8D%81%E4%BA%8C%E9%80%B2%E6%B3%95%E3%81%AE%E5%A4%95%E6%99%AF%E3%80%8DWEB%E4%BA%88%E5%91%8A_CuteGIF_20221216_174206.gif?raw=true",
    blurb: (
      <Translate>
        I built most parts of this website. Bad news: I'm not a web developer
        and don't know React
      </Translate>
    ),
    personalSiteUrl: "https://ocf.io/rmxu",
    githubUrl: "https://github.com/axmmisaka",
  },
];

export const past = [
  {
    name: "Soroush Bateni",
    personalSiteUrl: "https://personal.utdallas.edu/~soroush/",
    avatar: "https://avatars.githubusercontent.com/u/4221770?v=4",
    blurb: <Translate>Software Engineer at Apple.</Translate>,
  },
  {
    name: "Matt Chorlian",
    avatar: "https://avatars.githubusercontent.com/u/70343891?v=4",
    blurb: <Translate>Applied Math and CS student at UC Berkeley.</Translate>,
  },
  {
    name: "Anirudh Rengarajan",
    avatar: "https://avatars.githubusercontent.com/u/44007330?v=4",
    blurb: <Translate>Software Engineer at Bloomberg.</Translate>,
  },
  {
    name: "Martin Schoeberl",
    avatar: "https://avatars.githubusercontent.com/u/650648?v=4",
    blurb: <Translate>Professor at TU Denmark.</Translate>,
  },
  {
    name: "Matt Weber",
    avatar: "https://avatars.githubusercontent.com/u/3513451?v=4",
    blurb: <Translate>Software Engineer at Anyscale.</Translate>,
  },
  {
    name: "Hou Seng (Steven) Wong",
    avatar: "https://avatars.githubusercontent.com/u/46389172?v=4",
    blurb: <Translate>Software Development Engineer at Amazon AWS.</Translate>,
  },
];
