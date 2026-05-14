import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

interface FeatureGroup {
  title: string;
  items: string[];
}

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  about: string;
  featureGroups: FeatureGroup[];
  tags: string[];
  status: string;
  imageSrc: string;
  imageAlt: string;
  repoUrl: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly observers: IntersectionObserver[] = [];

  readonly activeProject = signal<Project | null>(null);

  readonly projects: Project[] = [
    {
      id: 'gerador-de-testes',
      title: 'Gerador de Testes',
      shortDescription: 'Sistema de geração de testes com questões aleatórias, exportação em PDF e gabarito automático.',
      about: 'Este projeto tem como objetivo desenvolver um sistema de geração de testes. O sistema possibilita a geração de testes com seleção aleatória de questões, incluindo funcionalidades como duplicação, visualização detalhada e exportação em PDF, tanto do teste quanto do gabarito.',
      featureGroups: [
        {
          title: 'Disciplinas',
          items: [
            'Cadastro, visualização, edição e exclusão de disciplinas.',
            'Deve armazenar informações sobre as matérias relacionadas.',
            'Não permite disciplinas com nomes duplicados.',
          ],
        },
        {
          title: 'Matérias',
          items: [
            'Cadastro, visualização, edição e exclusão de matérias.',
            'Campos obrigatórios: Nome, Disciplina e Série.',
            'Não permite registrar matérias com o mesmo nome.',
          ],
        },
        {
          title: 'Questões',
          items: [
            'Cadastro, visualização, edição e exclusão de questões.',
            'Campos obrigatórios: Matéria, Enunciado e Alternativas.',
            'Mínimo de duas alternativas, com obrigatoriamente uma correta.',
          ],
        },
        {
          title: 'Testes',
          items: [
            'Geração, visualização, duplicação e exclusão de testes.',
            'Campos obrigatórios: Título, Disciplina, Matéria e Quantidade de Questões.',
            'A quantidade informada deve ser ≤ ao total de questões cadastradas.',
            'Exportação em PDF do teste e do gabarito.',
          ],
        },
      ],
      tags: ['C#', 'ASP.NET', 'SQL Server'],
      status: 'Concluído',
      imageSrc: 'gerador-de-testes.gif',
      imageAlt: 'Demonstração do Gerador de Testes',
      repoUrl: 'https://github.com/estevaosantosribeiro/gerador-de-testes',
    },
    {
      id: 'e-agenda',
      title: 'e-Agenda',
      shortDescription: 'Agenda completa com gestão de contatos, compromissos, despesas, categorias e tarefas.',
      about: 'Este projeto tem como objetivo desenvolver um sistema de gestão para um ambiente relacionado à agenda pessoal e profissional, com controle de contatos, compromissos, despesas, categorias e tarefas de forma integrada.',
      featureGroups: [
        {
          title: 'Contatos',
          items: [
            'Cadastro, visualização, edição e exclusão de contatos.',
            'Validação de Nome (2–100 caracteres), E-mail e Telefone.',
            'Campos opcionais: Cargo e Empresa.',
            'Não permite contatos com e-mail ou telefone duplicados.',
          ],
        },
        {
          title: 'Compromissos',
          items: [
            'Cadastro, visualização, edição e exclusão de compromissos.',
            'Tipo de Compromisso: Remoto (com Link) ou Presencial (com Local).',
            'Impede agendamentos com conflito de horário.',
          ],
        },
        {
          title: 'Categorias e Despesas',
          items: [
            'Cadastro, visualização, edição e exclusão de categorias.',
            'Exibição de todas as despesas associadas a uma categoria.',
            'Despesas com Forma de Pagamento: À Vista, Crédito ou Débito.',
          ],
        },
        {
          title: 'Tarefas',
          items: [
            'Visualização de tarefas pendentes, concluídas e por prioridade.',
            'Campos: Título, Prioridade (Baixa / Normal / Alta), Percentual Concluído.',
            'Permite adicionar itens relacionados à tarefa.',
          ],
        },
      ],
      tags: ['C#', 'ASP.NET', 'SQL Server'],
      status: 'Concluído',
      imageSrc: 'e-agenda.gif',
      imageAlt: 'Demonstração do e-Agenda',
      repoUrl: 'https://github.com/estevaosantosribeiro/e-agenda',
    },
    {
      id: 'controle-de-medicamentos',
      title: 'Controle de Medicamentos',
      shortDescription: 'Sistema de gestão de medicamentos, pacientes, fornecedores, funcionários e prescrições médicas.',
      about: 'Este projeto tem como objetivo desenvolver um sistema de gestão para controle de medicamentos, pacientes, fornecedores, funcionários e prescrições médicas. O sistema é responsável por registrar, visualizar, editar e excluir dados, além de gerar relatórios de prescrições.',
      featureGroups: [
        {
          title: 'Cadastros',
          items: [
            'Fornecedores com validação de CNPJ único.',
            'Pacientes com validação de Cartão do SUS único.',
            'Medicamentos com controle de estoque automático e alerta abaixo de 20 unidades.',
            'Funcionários com validação de CPF único.',
          ],
        },
        {
          title: 'Requisições',
          items: [
            'Requisições de saída vinculadas a prescrições médicas com atualização automática de estoque.',
            'Requisições de entrada com atualização automática de estoque.',
          ],
        },
        {
          title: 'Prescrições Médicas',
          items: [
            'Cadastro de prescrições com medicamentos e dosagens.',
            'Geração de relatórios de prescrições.',
            'Validação de disponibilidade e alertas para limites excedidos.',
          ],
        },
      ],
      tags: ['C#', 'ASP.NET', 'MySQL'],
      status: 'Concluído',
      imageSrc: 'controle-de-medicamentos.gif',
      imageAlt: 'Demonstração do Controle de Medicamentos',
      repoUrl: 'https://github.com/estevaosantosribeiro/controle-de-medicamentos',
    },
    {
      id: 'gestao-de-equipamentos',
      title: 'Gestão de Equipamentos',
      shortDescription: 'Sistema para automação do controle de equipamentos e chamados de manutenção.',
      about: 'Este projeto tem como objetivo automatizar o controle de equipamentos e manutenções realizados na empresa. Com este sistema, é possível registrar, visualizar, editar e excluir equipamentos, além de gerenciar chamados de manutenção de forma prática e eficiente.',
      featureGroups: [
        {
          title: 'Equipamentos',
          items: [
            'Cadastro com nome, número de série, fabricante, data de fabricação e preço de aquisição.',
            'Edição completa das informações de um equipamento registrado.',
            'Visualização de todos os equipamentos cadastrados.',
            'Exclusão permanente do inventário.',
          ],
        },
        {
          title: 'Chamados de Manutenção',
          items: [
            'Abertura de chamados com título, descrição, equipamento relacionado e data de abertura.',
            'Edição de todas as informações de um chamado registrado.',
            'Visualização com tempo em aberto calculado automaticamente.',
            'Exclusão com atualização automática da lista.',
          ],
        },
      ],
      tags: ['C#', 'ASP.NET', 'SQL Server'],
      status: 'Concluído',
      imageSrc: 'gestao-de-equipamentos.gif',
      imageAlt: 'Demonstração da Gestão de Equipamentos',
      repoUrl: 'https://github.com/estevaosantosribeiro/gestao-de-equipamentos',
    },
  ];

  openModal(project: Project): void {
    this.activeProject.set(project);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    this.activeProject.set(null);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.activeProject()) this.closeModal();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.revealAll();
      return;
    }

    this.initReveal();
  }

  ngOnDestroy(): void {
    this.observers.forEach(o => o.disconnect());
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  private revealAll(): void {
    const el = this.host.nativeElement as HTMLElement;
    (el.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>).forEach(node => {
      node.style.opacity = '1';
      node.style.transform = 'none';
    });
  }

  private initReveal(): void {
    const el = this.host.nativeElement as HTMLElement;

    this.observeGroup(
      el.querySelector('.proj__header') as HTMLElement | null,
      (group) => {
        const items = group.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>;
        gsap.set(items, { opacity: 0, y: 24 });
        gsap.to(items, { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out' });
      },
    );

    this.observeGroup(
      el.querySelector('.proj__grid') as HTMLElement | null,
      (group) => {
        const cards = group.querySelectorAll('.proj__card') as NodeListOf<HTMLElement>;
        gsap.set(cards, { opacity: 0, y: 32 });
        gsap.to(cards, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.1 });
      },
    );
  }

  private observeGroup(el: HTMLElement | null, onEnter: (el: HTMLElement) => void): void {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        onEnter(el);
        obs.disconnect();
      },
      { threshold: 0.06 },
    );
    obs.observe(el);
    this.observers.push(obs);
  }
}
