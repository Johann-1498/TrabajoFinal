#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use DBI;
my $cgi = CGI->new;
my $token_sesion = $cgi->param('token');

if ($token_sesion) {
        my $consulta_validada = autenticar_usuario($token_sesion);
        if ($consulta_validada) {
            print $cgi->header(-type => 'application/json', -status => '200 OK');
            print encode_json(getTable());
        } else {
            print $cgi->header(-type => 'text/plain', -status => '500 Internal Server Error');
            print "Error al cargar datos de la tabla" ;
        }
}else{
    print $cgi->header(-type => 'text/plain', -status => '500 Internal Server Error');
    print "Error al obtener el token";
}
sub autenticar_usuario {
    my ($token) = @_;
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
   my $query = "SELECT * FROM users WHERE token_sesion = ? AND (rol = 'superAdmin' OR rol = 'admin')";
    my $sth = $dbh->prepare($query);
    $sth->execute($token);
    my $consulta_validada = $sth->fetchrow_hashref;
    $sth->finish;
    $dbh->disconnect;
    return $consulta_validada;
}

sub getTable {
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $query = "SELECT * FROM users ";
    my $sth = $dbh->prepare($query);
    $sth->execute();
    my @users;
    
    while(my $fila = $sth->fetchrow_arrayref) {
        push @users, $fila->[0];
    }
    
    $sth->finish;
    $dbh->disconnect;
    return @users; 
}