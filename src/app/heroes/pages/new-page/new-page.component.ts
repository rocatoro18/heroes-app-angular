import { HeroesService } from './../../services/heroes.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  // FORMULARIO REACTIVO DE HERO FORM
  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('',{nonNullable:true}),
    publisher: new FormControl<Publisher>(Publisher.MarvelComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    {id: 'DC Comics', desc: 'DC - Comics'},
    {id: 'Marvel Comics', desc: 'Marvel - Comics'}
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ){}

  get currentHero(): Hero{
    const hero = this.heroForm.value as Hero;

    //console.log(hero);

    return hero;
  }

  ngOnInit(): void {

    if(!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroById(id)),
      ).subscribe(hero => {

        // SI NO HAY NINGUN HERO, NAVEGAR A '/'
        if(!hero) {
          return this.router.navigateByUrl('/');
        }

        // SI SE TIENE HEROE, ASIGNAR LOS VALORES DEL MISMO AL FORMULARIO
        this.heroForm.reset(hero);
        return;


      })

  }

  onSubmit(): void {

    if(this.heroForm.invalid) return;

    //this.heroesService.updateHero(this.heroForm.value);

    if(this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackbar(`${hero.superhero} updated!`)
        });

        return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        // TODO: MOSTRAR SNACKBAR Y NAVEGAR A /heroes/edit/hero.id
        this.router.navigate(['/heroes/edit',hero.id]);
        this.showSnackbar(`${hero.superhero} created!`)
      })

  }

  onDeleteHero(){
    if(!this.currentHero.id) throw Error('hero id is required');


    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });


    dialogRef.afterClosed()
      .pipe(
        // FILTRAMOS RESULTADO POSITIVO
        filter((result: boolean) => result === true),
        // SE ELIMINA
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        //tap(wasDeleted => console.log({wasDeleted})),
        // SI SE ELIMINA SE TIENE ESTE WASDELETED Y SE DEJA PASAR
        filter((wasDeleted: boolean) => wasDeleted),
      )
      .subscribe(() => {
        // ESTO UNICAMENTE SE VA A DISPARAR SI SE ACEPTO ELIMINAR Y FUE DISPARADO
        //console.log({result})
        this.router.navigate(['/heroes']);
    })
      //console.log('The dialog was closed');
      //console.log({result});
      //if(!result) return;
    // FORMA ANTERIOR DE HACER LO DE ARRIBA
    //  this.heroesService.deleteHeroById(this.currentHero.id)
    //    .subscribe(wasDeleted => {
    //      if(wasDeleted){
    //        this.router.navigate(['/heroes']);
    //      }
    //    })
    //
    //});


  }

  showSnackbar(message: string): void {
    this.snackbar.open(message,'done',{
      duration: 2500,
    });
  }

}
