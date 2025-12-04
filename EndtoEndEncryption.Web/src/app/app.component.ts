import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { UserModel } from './models/user.model';
import { FormsModule } from '@angular/forms';
import { SecureService } from './services/secure.service';
import { CryptoService } from './services/crypto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public title: string = 'End to End Encryption Demo';
  public message: string = '';
  public registration: UserModel = new UserModel();
  
  constructor(private userService: UserService, private secureService: SecureService, private cryptoService: CryptoService) {
  }

  ngOnInit(): void {
    this.secureService.GetServerPublicKey().subscribe(data => {
      if(data && data.publicKey){
        this.cryptoService.setServerPublicKey(data.publicKey);
      }
    });
  }

  public Save(isFormValid: boolean): void {
    if (isFormValid) {
        this.userService.Registration(this.registration).subscribe(data => {
            if (data && data.success) {
                this.message = 'Registration is successful, Please check your mail and active your account.';
            } else {
                this.message = 'Registration failed, please try again.';
            }
        });
    } else {
        this.message = 'Please provide valid input.';
    }
}
}
